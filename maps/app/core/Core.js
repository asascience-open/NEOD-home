var app = {};
app.themeIndex = 0,
app.timeSlider = [],
app.lastSubTheme = 0,
app.sidePanelVisible = true,
app.legendVisible = true,
app.fullServices = [],
app.layerInfos = [],
app.timeoutID,
app.unOrderedGroups = [],
app.groupCount = 9,
app.fullServiceUrls = [
    'http://50.19.218.171/arcgis1/rest/services/Administrative/MapServer/',
    'http://50.19.218.171/arcgis1/rest/services/SiteDev/Energy/MapServer/',
    'http://50.19.218.171/arcgis1/rest/services/SiteDev/MarineMammalsAndSeaTurtles/MapServer/',
    'http://50.19.218.171/arcgis1/rest/services/SiteDev/OtherMarineLife/MapServer/',
    'http://50.19.218.171/arcgis1/rest/services/SiteDev/RecreationAndCulture/MapServer/'
];
define([
    'esri/map',
    'esri/request',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/dijit/Scalebar',
    'esri/dijit/Legend',
    'esri/geometry/Point',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate',
    'esri/tasks/LegendLayer',
    'esri/tasks/PrintTask',
    'dojo/query',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/dnd/move',
    'dojo/dom-class',
    'dojo/fx',
    'dojo/_base/fx',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/store/Memory',
    'dijit/tree/ObjectStoreModel',
    'dijit/Tree',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    'dijit/DropDownMenu',
    'dijit/MenuItem',
    'dijit/form/Button',
    'bootstrap/Dropdown',
    'bootstrap/Collapse',
    'bootstrap/Modal',
    'bootstrap/Tooltip',
    'bootstrap/Carousel',
    'dojo/domReady!',
    'bootstrap/Tab'
    ], 
    function(
        Map,
        EsriRequest,
        ArcGISDynamicMapServiceLayer,
        ArcGISImageServiceLayer,
        ArcGISTiledMapServiceLayer,
        Scalebar,
        Legend,
        Point,
        PrintParameters,
        PrintTemplate,
        LegendLayer,
        PrintTask,
        query,
        on,
        domConstruct,
        move,
        domClass,
        coreFx,
        fx,
        array,
        dom,
        domAttr,
        domStyle,
        registry,
        Memory,
        ObjectStoreModel,
        Tree,
        CheckBox,
        DropDownButton,
        DropDownMenu,
        MenuItem,
        Button
        ) 
    {
        //isMobile();

        function init()
        {
            // create buttons for each theme
            array.forEach(configOptions.themes, function (theme, themeIndex){
                //domConstruct.place('<li><a dataIdx='+ themeIndex + ' id="dropdownTheme' + themeIndex + '" href="#">' + theme.title.toUpperCase() + '</a></li>', 'themeDropdown');
                domConstruct.place('<button id="theme' + themeIndex + '" type="button" class="btn no-bottom-border-radius' + (themeIndex === (configOptions.themes.length - 1) ? ' no-bottom-right-border-radius"' : '"') + ' data-toggle="button">' + theme.title.toUpperCase() + '</button>', 'themeButtonGroup');
            });

            getLayerIds();

            resizeMap();

            esri.config.defaults.io.proxyUrl = "http://services.asascience.com/Proxy/esriproxy/proxy.ashx";

            app.currentSubThemeIndex = 0;
        }

        function resizeMap()
        {
            app.screenHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            app.screenWidth = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
            app.headerOffset = query('.navbar-fixed-top').style('height')[0];
            app.sidePanelWidth = 281;

            query('.main').style({
                'height'        : (app.screenHeight - app.headerOffset) + 'px',
                'marginTop'    : app.screenWidth < 980 ? '0' : app.headerOffset + 'px'
            });
            query('.map').style({
               'height'        : (app.screenHeight - app.headerOffset) + 'px'
            });
        }

        function resizeSidePanel() {
            var treeHeight = (app.screenHeight - app.headerOffset - 46 /*top button*/)/2;
            dojo.query('#tree').style('height', treeHeight + 'px');
            dojo.query('#legend').style('height', (treeHeight - 26) + 'px');
            dojo.query('#layer-info').style('height', treeHeight + 'px');
        }

        window.onresize = function(event) {
            resizeMap();
            resizeSidePanel();
        };

        function print() 
        {
            var params = new PrintParameters();
            var template = new PrintTemplate();

            var legendLayers = [];
            for (var i = 1; i < app.currentMap.layerIds.length; i++){
                var legendLayer = new LegendLayer();
                legendLayer.layerId = app.currentMap.layerIds[i];
                legendLayers.push(legendLayer);
            }   
            
            template.format = "png32";          
            template.layout = "A3 Landscape";           
            template.preserveScale = false;
            template.layoutOptions = {};
            
            template.layoutOptions.titleText = configOptions.themes[app.themeIndex].title + ' | ' + configOptions.themes[app.themeIndex].maps[app.currentSubThemeIndex].title;
            template.layoutOptions.authorText = 'Northeast Ocean Data Portal';
            template.layoutOptions.legendLayers = legendLayers;

            params.template = template;
            params.map = app.currentMap;

            var printTask = new PrintTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task", params);

            printTask.execute(params, function printTaskCallback(result) {
                window.open(result.url);
                query('#printButton').button('reset');
            });
        }

        function createBasemapGallery()
        {    
            var basemaps = new Array('Oceans', 'Satellite', 'Chart');
            var i = 0;
            var basemapMenu = new DropDownMenu();
            for (i; i < 3; i++) {
                var item = new MenuItem({
                    label       : basemaps[i],
                    iconClass   : "thumbnail" + i + " thumbMap",
                    onClick     : function(e){
                        switch (this.label){
                            case 'Oceans':
                                app.map.setBasemap('oceans');
                                app.map.chart.hide();
                                break;
                            case 'Satellite':
                                app.map.setBasemap('satellite');
                                app.map.chart.hide();
                                break;
                            case 'Chart':
                                app.map.chart.show();
                                var basemapLayerID = app.map.basemapLayerIds[0];
                                for (var prop in app.map._layers)
                                    if (prop == basemapLayerID)
                                        app.map._layers[prop].hide();
                                app.map._basemap = 'chart';
                                break;
                        }
                    }
                });
                basemapMenu.addChild(item);
            };
            basemapMenu.startup();
            var basemapButton = new DropDownButton({
                label   : "Basemaps",
                id      : "basemap-dropdown",
                dropDown: basemapMenu,
            });
            basemapButton.startup();
            dom.byId('basemapDropdownContainer').appendChild(basemapButton.domNode);

            var locations = [
                {
                    label   :   'Northeast',
                    lat     :   -71.5,
                    lon     :   42,
                    level   :   7
                },
                {
                    label   :   'Cape Cod',
                    lat     :   -70.261903,
                    lon     :   41.797936,
                    level   :   10
                },
                {
                    label   :   'Gulf of Maine',
                    lat     :   -68.901615,
                    lon     :   42.851806,
                    level   :   8
                },
                {
                    label   :   'Long Island Sound',
                    lat     :   -72.824464,
                    lon     :   41.111434,
                    level   :   10
                }
            ];
            var zoomToMenu = new DropDownMenu();
            for (i = 0; i < locations.length; i++){
                var item = new MenuItem({
                    label   : locations[i].label,
                    lat     : locations[i].lat,
                    lon     : locations[i].lon,
                    level   : locations[i].level,
                    onClick : function(e){
                        app.map.centerAndZoom(new Point(this.lat, this.lon), this.level);
                    }
                });
                zoomToMenu.addChild(item);
            }
            zoomToMenu.startup();
            var zoomToButton = new DropDownButton({
                label   : "Zoom to",
                dropDown: zoomToMenu
            });
            zoomToButton.startup();
            dom.byId('zoomToDropdownContainer').appendChild(zoomToButton.domNode);

            var shareButton = new Button({
                label: 'Share',
                onClick: function() {
                    //dijit.byId('share-dialog').show();
                    alert('share button clicked');
                }
            }, "shareButton").startup();

            var printButton = new Button({
                label: 'Print',
                onClick: function() {
                    //print();
                    alert('print button clicked');
                }
            }, "printButton").startup();
        }

        // function share()
        // {
        //     var longUrl = '';
        //     var point = new esri.geometry.Point(app.currentMap.extent.getCenter());
        //     var baseUrl = mapUrl;
        //     if (baseUrl.indexOf("#") > 0)
        //         baseUrl = baseUrl.substring(0, mapUrl.indexOf('#'));
        //     if (baseUrl.indexOf("&z=") > 0)
        //         baseUrl = baseUrl.substring(0, mapUrl.indexOf('z') - 1);
            
        //     var wlf = window.location.href; 
        //     var pil = '#?page_id='; 
        //     if (wlf.search("maps/maritime-commerce") != -1) pil += "1118"; 
        //     else if (wlf.search("maps/energy") != -1) pil += "1120"; 
        //     else if (wlf.search("maps/recreation") != -1) pil += "1650"; 
        //     else if (wlf.search("maps/commercial-fishing") != -1) pil += "1779"; 
        //     else if (wlf.search("maps/aquaculture") != -1) pil += "1122"; 
        //     else if (wlf.search("maps/fish-and-shellfish") != -1) pil += "1652"; 
        //     else if (wlf.search("maps/marine-life-mammals") != -1) pil += "1380"; 
        //     else if (wlf.search("maps/other-marine-life") != -1) pil += "1654"; 
            
        //     longUrl += baseUrl.replace('#', '') + pil +'&z=' + app.map.getZoom() + '&b=' + app.map._basemap + '&m=' + cm + '&r=' + radioSelection + '&x=' + point.x + '&y=' + point.y;

        //     if (mapUrl.indexOf(energy) > 0)
        //         longUrl += '&sl=' + sliderValue;
        //     // $j.ajax({
        //     //     type: 'GET',
        //     //     url: 'http://api.bit.ly/v3/shorten',
        //     //     dataType: "jsonp",
        //     //     data: {
        //     //         login: 'ssontag',
        //     //         apiKey: 'R_3802a64a9ae967439f44d5aebe7eabb8',
        //     //         format: 'json',
        //     //         longUrl: longUrl
        //     //     },
        //     //     success: function(data){
        //     //         $j('div#share-me').text(data.data.url);
        //     //         $j('div#share-dialog p#url').html('<a href="' + data.data.url + '" target="_blank">' + data.data.url + '</a>');
        //     //     }
                
        //     // });
        // }

        function createMap()
        {
            getFullServices();

            query(".collapse").collapse();

            app.map = new Map('map-pane',{
                    basemap                 : 'oceans',
                    zoom                    : 7,
                    minZoom                 : 7,
                    maxZoom                 : 14,
                    logo                    : false,
                    nav                     : false,
                    sliderStyle             : 'small',
                    showInfoWindowOnClick   : false,
                    center                  : [-71.5, 42],
                    showAttribution         : false,
                    sliderPosition          : 'top-left',
                    autoResize              : true
                });

            app.map.on('update-start', function(e) {
                dom.byId('loading').style.display ='block';
            });

            app.map.on('update-end', function(e) {
                dom.byId('loading').style.display ='none';
                if (app.legend)
                    app.legend.refresh();
            });

            app.map.chart = new ArcGISImageServiceLayer('http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');

            app.map.addLayer(app.map.chart, 1);
            app.map.chart.hide();

            var scalebar = new Scalebar({
                map         : app.map,
                attachTo    : 'bottom-right'
            });

            app.map.on('load', function(){
                updateScale();
                query('#mapList .button-container').style({'visibility' : 'visible'});
                createBasemapGallery();
                domStyle.set(dom.byId('themeButtonGroup'), 'visibility', 'visible');
                domStyle.set(dom.byId('side-panel'), 'visibility', 'visible');
                domStyle.set(dom.byId('loading'), 'visibility', 'visible');
                resizeSidePanel();
            });

            dojo.byId()

            app.map.on('layers-add-result', function () {
                app.legend = new Legend({
                    map         : app.map,
                    layerInfos  : app.layerInfos,
                    autoUpdate  : false
                }, 'legend');
                app.legend.startup();
            });

            app.map.on('zoom-end', function (e) {
                checkMinScale();
                updateScale();
            })

            // query('#shareButton').on('click', function (e){
            //     query('#shareModal').modal('show');
            //     //share();
            // });

            // query('.btn').on('click', function (e){
            //     focusUtil.curNode && focusUtil.curNode.blur();
            // });

            // on(dom.byId('printButton'), 'click', function (e){
            //     query(e.target).button('loading');
            //     print();
            // });

            //get print templates from the export web map task
            // var printInfo = EsriRequest({
            //     url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
            //     content: { f: "json" }
            // });

            on(dom.byId('show-hide-btn'), 'click', function (e){
                var sidePanel = dom.byId('side-panel');
                var width = '100%';
                if (app.sidePanelVisible) {
                    coreFx.slideTo({ node:  sidePanel, left: (domStyle.get(sidePanel, 'width') * -1), top: 0 }).play();
                    coreFx.slideTo({ node:  this.parentNode, left: 31, top: 0 }).play();
                    app.map.resize(true);
                    app.sidePanelVisible = false;
                    domStyle.set(this, {
                        borderLeft  : '10px solid #D1D2D4',
                        borderRight : '0'
                    });
                    domAttr.set(this, 'title', 'Show Panel');
                }
                else {
                    coreFx.slideTo({ node:  sidePanel, left: 0, top: 0 }).play();
                    app.sidePanelVisible = true;
                    domStyle.set(this, {
                        borderRight : '10px solid #D1D2D4',
                        borderLeft  : '0'
                    });
                    coreFx.slideTo({ node:  this.parentNode, left: 0, top: 0 }).play();
                    domAttr.set(this, 'title', 'Hide Panel');
                }
            });

            on(dom.byId('show-hide-legend-btn'), 'click', function (e) {
                var tree = dom.byId('tree'),
                    layerInfo = dom.byId('layer-info');
                var currentTreeHeight = domStyle.get(tree, 'height');
                if (app.legendVisible) {
                    var expandTree = fx.animateProperty({
                        node: tree,
                        properties: {
                            height: (currentTreeHeight * 2) - 15
                        }
                    });
                    var expandLayerInfo = fx.animateProperty({
                        node: layerInfo,
                        properties: {
                            height: (currentTreeHeight * 2) - 15
                        }
                    });
                    coreFx.combine([expandTree, expandLayerInfo]).play();
                    app.legendVisible = false;
                    domStyle.set(this, {
                        borderBottom  : '10px solid #D1D2D4',
                        borderTop : '0'
                    });
                    domAttr.set(this, 'title', 'Show Legend');
                }
                else {
                    var collapseTree = fx.animateProperty({
                        node: tree,
                        properties: {
                            height: (currentTreeHeight / 2) + 7.5
                        }
                    });
                    var collapseLayerInfo = fx.animateProperty({
                        node: layerInfo,
                        properties: {
                            height: (currentTreeHeight / 2) + 7.5
                        }
                    });
                    coreFx.combine([collapseTree, collapseLayerInfo]).play();
                    app.legendVisible = true;
                    domStyle.set(this, {
                        borderTop : '10px solid #D1D2D4',
                        borderBottom  : '0'
                    });
                    domAttr.set(this, 'title', 'Hide Legend');
                }
            });
        }

        function getFullServices() {
            var requestCount = 0;
            array.forEach(app.fullServiceUrls, function (serviceUrl, mapIndex) {
                var request = EsriRequest({
                    url: serviceUrl,
                    content: {
                        f: "json"
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });

                request.then(
                    function(result) {
                        result.url = app.fullServiceUrls[mapIndex];
                        result.documentInfo.Title = configOptions.comp_viewer.fullServices[mapIndex].title;
                        result.index = configOptions.comp_viewer.fullServices[mapIndex].index;
                        array.forEach(configOptions.comp_viewer.fullServices[mapIndex].layers, function (configLayer) {
                            array.forEach(result.layers, function (layer) {
                                if (layer.name === configLayer.name) {
                                    layer.metadata = configLayer.metadata;
                                    if (configLayer.external)
                                        layer.external = configLayer.external;
                                    if (configLayer.noSource)
                                        layer.noSource = configLayer.noSource;
                                    layer.index = configOptions.comp_viewer.fullServices[mapIndex].index;
                                }
                            });
                        });
                        app.fullServices.push(result);
                        requestCount++;
                        if (requestCount == app.fullServiceUrls.length)
                            createTree();
                    }, function(error) {
                        console.log("Error: ", error.message);
                });
            });
        }

        function createTree() {
            app.myStore = new Memory({getChildren: function (object) {
                    return this.query({parent: object.id});
                }
            });
            app.myStore.data.push({id: 'server', name: 'MapServers', root: true});
            array.forEach(app.fullServices, function (service, i) {
                app.unOrderedGroups.push({
                    id          : service.url,
                    name        : service.documentInfo.Title,
                    type        : 'mapserver',
                    parent      : 'server',
                    hasChildren : true,
                    index       : service.index
                });
                // });
                if (service.layers.length > 0) {
                    array.forEach(service.layers, function (layer, j) {
                        if (layer.subLayerIds == null)
                            app.unOrderedGroups.push({
                                name        : layer.label ? layer.label : layer.name,
                                type        : 'layer',
                                parent      : layer.parentLayerId == -1 ? service.url : service.url + '_subgroup-' + layer.parentLayerId,
                                hasChildren : false,
                                service     : service.documentInfo.Title,
                                minScale    : layer.minScale == 0 ? null : layer.minScale,
                                id          : service.url + layer.id + '-',
                                metadata    : layer.metadata,
                                external    : layer.external ? layer.external : null,
                                noSource    : layer.noSource ? layer.noSource : null,
                                index       : service.index
                            });
                        else
                            app.unOrderedGroups.push({
                                id          : service.url + '_subgroup-' + layer.id,
                                name        : layer.label ? layer.label : layer.name,
                                type        : 'layer-group',
                                parent      : service.url,
                                hasChildren : true,
                                index       : service.index
                            });
                    });
                }
            });

            // create layer group from config list
            array.forEach(configOptions.comp_viewer.groups, function (group, i) {
                app.unOrderedGroups.push({
                    id          : group.title,
                    name        : group.title,
                    type        : 'mapserver',
                    parent      : 'server',
                    hasChildren : true,
                    sameService : false,
                    index       : group.index
                });
                if (group.layers.length > 0) {
                    array.forEach(group.layers, function (layer, j) {
                        app.unOrderedGroups.push({
                            name        : layer.label ? layer.label : layer.name,
                            type        : 'layer',
                            parent      : group.title,
                            hasChildren : false,
                            service     : group.title,
                            minScale    : (layer.minScale == 0) ? null : layer.minScale,
                            id          : layer.url + layer.id + '-',
                            tile        : layer.tile,
                            metadata    : layer.metadata,
                            realName    : layer.label ? layer.name : null,
                            external    : layer.external ? layer.external : null,
                            index       : layer.index
                        });
                    });
                }
            });

            for (var i = 0; i < app.groupCount; i++) {
                array.forEach(app.unOrderedGroups, function (item, j) {
                    if (item.index === i)
                        app.myStore.data.push(item);
                });
            }

            // create the model
            app.myModel = new ObjectStoreModel({
                store: app.myStore,
                query: {id: 'server'}
            });

            // create the tree
            app.tree = new Tree({
                model: app.myModel,
                showRoot: false,
                getIconClass: function (item, opened) {
                    return (!item || item.hasChildren) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : ""
                },
                getRowClass: function (item, opened) {
                    return (!item.hasChildren) ? "no-children" : "";
                },
                onOpen: function (item, node) {
                    if (!item.root) {
                        if (query('input[type="checkbox"]', node.domNode).length == 0) {
                            var subgroup = 0,
                            service = item.id;
                            if (service.match(/_/)) {
                                subgroup = parseInt(service.substr(service.indexOf('-') + 1), 10) + 1;
                                service = service.substr(0, service.indexOf('_'));
                            }
                            if (item.sameService != undefined) {
                                var dataIndex = 0;
                                array.forEach(app.tree.model.store.data, function (v, i) {
                                    if (v.name == service && v.hasChildren) {
                                        dataIndex = i + 1;
                                        return false;
                                    }
                                });
                            }
                            array.forEach(query('.no-children', node.domNode), function (element, i) {
                                var checkboxId = service + (subgroup + i);
                                var tile;
                                if (dataIndex != undefined) {
                                    checkboxId = app.tree.model.store.data[dataIndex].id.substr(0, app.tree.model.store.data[dataIndex].id.length-1);
                                    tile = app.tree.model.store.data[dataIndex].tile;
                                    dataIndex++;
                                }
                                if (registry.byId(checkboxId))
                                    checkboxId += 'duplicate';
                                domConstruct.place('<input type="checkbox" id="' + checkboxId + '" />', element, 'first');
                                var checkBox = new CheckBox({
                                    name: checkboxId,
                                    checked: false,
                                    tile: tile,
                                    onChange: function(b) {
                                        var name = this.get('name');
                                        var tile = this.get('tile');
                                        var service = name.substr(0, name.indexOf('/')),
                                            id = parseInt(name.substr(name.lastIndexOf('/') + 1), 10);
                                        if (name.match(/http:/)) {
                                            service = name.substr(0, name.lastIndexOf('/') + 1);
                                            var theme = true;
                                        }
                                        checkboxChange(b, service, id, theme, tile);
                                    }
                                }, checkboxId).startup();
                                domConstruct.place('<span role="presentation" class="dijitInline dijitIcon dijitTreeIcon dijitIconFile" data-dojo-attach-point="iconNode" title="Layer Information" data-service_layer="' + checkboxId + '"></span>', element, 'last');
                            });
                        }
                        checkMinScale();

                        on(query('.dijitIconFile'), 'click', function (e) {
                            dom.byId('loading').style.display = 'block';
                            var serviceUrl = e.target.attributes['data-service_layer'].value;
                            if (serviceUrl.match(/duplicate/))
                                serviceUrl = serviceUrl.substr(0, serviceUrl.indexOf('duplicate'));
                            dojo.query('#tree').hide();
                            dojo.query('#layer-info').show();
                            var request = EsriRequest({
                                url: serviceUrl,
                                content: {
                                    f: "json"
                                },
                                handleAs: "json",
                                callbackParamName: "callback"
                            });

                            request.then(
                                function(result) {
                                    var contentHtml = '<div id="layer-info-content"><h5>' + result.name + '</h5>';
                                    contentHtml += '<div class="color-gradient"></div>';
                                    if (result.copyrightText != '')
                                        contentHtml += '<p><strong>Source:</strong> ' + result.copyrightText + '</p>';
                                    contentHtml += '<strong>Description:</strong><p id="description-text">' + result.description;
                                    var id = parseInt(serviceUrl.substr(serviceUrl.lastIndexOf('/') + 1), 10),
                                        metadataLink = '';
                                    var sourceDataHtml = '<a href="#" onClick="sourceDataClick(\'' + result.name + '\')">Source Data</a>';
                                    var dataIndex = 0;
                                    array.forEach(app.tree.model.store.data, function (v, i) {
                                        if (v.name === result.name || v.realName === result.name) {
                                            dataIndex = i;
                                            return false;
                                        }
                                    });
                                    metadataLink = app.tree.model.store.data[dataIndex].metadata;
                                    if (app.tree.model.store.data[dataIndex].noSource)
                                        sourceDataHtml = 'Source Data';
                                    if (app.tree.model.store.data[dataIndex].external)
                                        sourceDataHtml = '<a href="' + app.tree.model.store.data[dataIndex].external + '" target="_blank">Source Data (External)</a>';
                                    contentHtml += '<br /><br /><strong>Data:</strong> ';
                                    if (metadataLink === '')
                                        contentHtml += 'Metadata | ';
                                    else
                                        contentHtml += '<a href="' + metadataLink + '" target="_blank">Metadata</a> | ';
                                    var extent = new esri.geometry.Extent(result.extent);
                                    var centerPoint = extent.getCenter();
                                    contentHtml += sourceDataHtml + ' | <a href="' + serviceUrl + '" target="_blank">Web Service</a> | <a href="#" onClick="app.map.centerAndZoom(new esri.geometry.Point(' + centerPoint.getLongitude() + ', ' + centerPoint.getLatitude() + '), 7);">Zoom to Layer</a>';
                                    dom.byId('loading').style.display = 'none';
                                    domConstruct.place(contentHtml + '</p></div>', dojo.byId('layer-info-content'), 'replace');
                                }, function(error) {
                                    console.log("Error: ", error.message);
                            });
                        });
                    }
                }
            });
            app.tree.placeAt(dojo.byId('tree'));
            app.tree.startup();

            on(dom.byId('remove-layers'), 'click', function (e){
                e.preventDefault();
                array.forEach(app.map.layerIds, function (layerId) {
                    if (app.map._layers[layerId].url != 'http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer' &&
                        app.map._layers[layerId].url != 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' &&
                        app.map._layers[layerId].url != 'http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer' &&
                        app.map._layers[layerId].url != 'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer') {
                        if (!app.map._layers[layerId].setVisibleLayers)
                            app.map._layers[layerId].hide();
                        else
                            app.map._layers[layerId].setVisibleLayers([-1]);
                    }
                });
                array.forEach(registry.toArray(), function (widget, i) {
                    if(widget.type == 'checkbox')
                        if (widget.checked)
                            widget.set('checked', false);
                });
            });
            on(dom.byId('back-to-layers'), 'click', function (e) {
                e.preventDefault();
                dojo.query('#tree').show();
                dojo.query('#layer-info').hide();
            });
        }

        function checkMinScale() {
            var scale = app.map.getScale();
            array.forEach(registry.toArray(), function (widget, i) {
                if (widget.hasOwnProperty('item')) {
                    if (widget.item.hasOwnProperty('minScale')) {
                        if (widget.item.minScale != null) {
                            var checkboxWidget = registry.byId(widget.item.id.substr(0, widget.item.id.indexOf('-')));
                            if (widget.item.minScale < scale) {
                                if (!checkboxWidget.get('disabled')) {
                                    checkboxWidget.set('disabled', true);
                                    domConstruct.place('<span class="zoom-notice" id="' + widget.item.id + 'zoom">zoom to view</span>', widget.domNode.childNodes[0]);
                                }
                            }
                            else
                                if (checkboxWidget.get('disabled')) {
                                    checkboxWidget.set('disabled', false);
                                    domConstruct.destroy(widget.item.id + 'zoom');
                                }
                        }
                    }
                }

            });
        }

        function updateScale() {
            dom.byId('scale').innerHTML = "Scale 1:" + app.map.__LOD.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        sourceDataClick = function (layerName) {
            console.log(layerName);
            var request = EsriRequest({
                url: 'http://50.19.218.171/arcgis1/rest/services/ClipZip/GPServer/Extract%20Data%20TaskKML/submitJob?Raster%5FFormat=File%20Geodatabase%20%2D%20GDB%20%2D%20%2Egdb&Area%5Fof%5FInterest=%7B%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%2C%22features%22%3A%5B%7B%22geometry%22%3A%7B%22rings%22%3A%5B%5B%5B%2D8374903%2E335905621%2C4717593%2E676607473%5D%2C%5B%2D7176370%2E7323943805%2C4717593%2E676607473%5D%2C%5B%2D7176370%2E7323943805%2C5570019%2E416043529%5D%2C%5B%2D8374903%2E335905621%2C5570019%2E416043529%5D%2C%5B%2D8374903%2E335905621%2C4717593%2E676607473%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D%7D%5D%7D&Layers%5Fto%5FClip=%5B%22' + layerName + '%22%5D&env%3AoutSR=102100&env%3AprocessSR=102100&f=json&Feature%5FFormat=File%20Geodatabase%20%2D%20GDB%20%2D%20%2Egdb&Spatial%5FReference=WGS%201984',
                content: {
                    f: "json"
                },
                handleAs: "json",
                callbackParamName: "callback"
            });

            request.then(
                function(result) {
                    dojo.setStyle(dojo.byId('source-download-loading'), 'visibility', 'visible');
                    dojo.setStyle(dojo.byId('loading-message'), 'display', 'block');
                    dojo.setStyle(dojo.byId('source-data-downlaod'), 'display', 'none');
                    dojo.query('#source-data-modal').modal('show');
                    checkJobStatus(result.jobId);
                }, function(error) {
                    console.log("Error: ", error.message);
            });
        }

        checkJobStatus = function (jobId) {
            timeoutId = window.setTimeout( function() {
                var request = EsriRequest({
                    url: 'http://50.19.218.171/arcgis1/rest/services/ClipZip/GPServer/Extract%20Data%20TaskKML/jobs/' + jobId,
                    content: {
                        _ts : Date.now(),
                        f   : 'json'
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });

                request.then(
                    function(result) {
                        if (result.jobStatus == "esriJobSucceeded") {
                            dojo.setStyle(dojo.byId('source-download-loading'), 'visibility', 'hidden');
                            dojo.setStyle(dojo.byId('loading-message'), 'display', 'none');
                            dojo.setAttr(dojo.byId('source-data-downlaod'), 'href', 'http://50.19.218.171/arcgis1/rest/directories/arcgisjobs/clipzip_gpserver/' + result.jobId + '/scratch/output.zip');
                            dojo.setStyle(dojo.byId('source-data-downlaod'), 'display', 'block');
                        }
                        else
                            checkJobStatus(jobId);
                    }, function(error) {
                        console.log("Error: ", error.message);
                });
            }, 5000);
        }

        getLayerIds = function ()
        {
            app.layersLoaded = 0,
            app.layersUnloaded = 0;
            array.forEach(configOptions.comp_viewer.groups, function (group, groupIndex) {
                app.layersUnloaded += group.layers.length;
                array.forEach(group.serviceURLs, function (serviceURL, i) {
                    request = EsriRequest({
                        url: serviceURL + 'layers',
                        content: {
                            f: "json"
                        },
                        handleAs: "json",
                        callbackParamName: "callback"
                    });

                    request.then(
                        function(data) {
                            array.forEach(data.layers, function (layerObj, i) {
                                array.forEach(group.layers, function (layer, j) {
                                    if (layer.service === serviceURL && layer.name === layerObj.name && (layer.parent === undefined || layer.parent === layerObj.parentLayer.name))
                                    {
                                        layer.id            = layerObj.id,
                                        layer.description   = layerObj.description,
                                        layer.minScale      = layerObj.minScale,
                                        layer.url           = serviceURL,
                                        layer.index         = group.index;
                                        app.layersLoaded++;
                                        if (app.layersLoaded === app.layersUnloaded)
                                            createMap();
                                    }
                                });
                            });
                        }, function(error) {
                            console.log("Error: ", error.message);
                    });
                });
            });
        }

        checkboxChange = function (b, service, id, theme, tile) {
            var visibleLayers = [];
            if (b) {
                if (!app.map._layers[service]) {
                    if (theme) {
                        if (tile)
                            var layer = new ArcGISTiledMapServiceLayer(service, {id : service});
                        else
                            var layer = new ArcGISDynamicMapServiceLayer(service, {id : service});
                    }
                    else
                        var layer = new ArcGISDynamicMapServiceLayer(app.serverUrl + service + '/MapServer', {id : service});
                    app.layerInfos.push({layer: layer});
                    visibleLayers = [id];
                    app.map.addLayers([layer]);
                }
                else {
                    array.forEach(app.map._layers[service].visibleLayers, function (layerId) {
                        visibleLayers.push(layerId);
                    });
                    visibleLayers.push(id);
                }
            }
            else {
                array.forEach(app.map._layers[service].visibleLayers, function (layerId) {
                    if (layerId != id)
                        visibleLayers.push(layerId);
                });
                if (visibleLayers.length == 0)
                    visibleLayers[0] = -1;
            }
            if (tile) {
                if (b)
                    app.map._layers[service].show();
                else {
                    app.map._layers[service].hide();
                    app.legend.refresh();
                }
            }
            else
                app.map._layers[service].setVisibleLayers(visibleLayers);
        }

        return {
            init: init
        }
    }
);