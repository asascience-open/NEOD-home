var app = {};
app.themeIndex = 0,
app.timeSlider = [],
app.lastSubTheme = 0,
app.sidePanelVisible = true,
app.legendVisible = true,
app.layerInfos = [],
app.timeoutID,
app.lv = false,
app.firstLV_load = true;
define([
    'esri/map',
    'esri/request',
    'esri/layers/FeatureLayer',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/InfoTemplate',
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
    'dojo/request/notify',
    'dojo/fx',
    'dojo/_base/fx',
    'dojo/_base/array',
    'dojo/behavior',
    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/store/Memory',
    'dijit/tree/ObjectStoreModel',
    'dijit/Tree',
    'dijit/form/CheckBox',
    'dijit/form/DropDownButton',
    'dijit/form/HorizontalSlider',
    'dijit/DropDownMenu',
    'dijit/MenuItem',
    'dijit/form/Button',
    'dijit/form/FilteringSelect',
    'bootstrap/Tooltip',
    'bootstrap/Modal',
    'bootstrap/Tab',
    'dojo/domReady!'
    ], 
    function(
        Map,
        EsriRequest,
        FeatureLayer,
        ArcGISDynamicMapServiceLayer,
        ArcGISImageServiceLayer,
        ArcGISTiledMapServiceLayer,
        InfoTemplate,
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
        notify,
        coreFx,
        fx,
        array,
        behavior,
        dom,
        domAttr,
        domStyle,
        registry,
        Memory,
        ObjectStoreModel,
        Tree,
        CheckBox,
        DropDownButton,
        HorizontalSlider,
        DropDownMenu,
        MenuItem,
        Button,
        FilteringSelect
        ) 
    {
        //isMobile();

        function init()
        {
            // create buttons for each theme
            array.forEach(configOptions.themes, function (theme, themeIndex){
                domConstruct.place('<button id="theme' + themeIndex + '" data-theme-id="' + themeIndex + '" type="button" class="btn no-bottom-border-radius' + (themeIndex === (configOptions.themes.length - 1) ? ' active-theme no-bottom-right-border-radius"' : '"') + ' data-toggle="button">' + theme.title.toUpperCase() + '</button>', 'themeButtonGroup');
            });

            app.navbar = dom.byId('navbar'),
            app.sidePanel = dom.byId('side-panel');

            on(dojo.query('#themeButtonGroup button'), 'click', function (e) {
                app.currentThemeIndex = parseInt(this.attributes["data-theme-id"].value, 10);
                domClass.remove(query('#themeButtonGroup .active-theme')[0], 'active-theme');
                if (app.currentThemeIndex !== 10) { // 10 is data viewer
                    if (app.currentThemeIndex === 0) { // 0 is maritime commerce
                        domClass.add(this, 'active-theme');
                        app.lv = true;
                        getLayerIds(app.lv);
                        app.currentThemeIndex = parseInt(this.attributes["data-theme-id"].value, 10);
                    }
                }
                else {
                    domClass.add(this, 'active-theme');
                    app.sidePanel.style.display = 'block';
                    query('.legendDiv').forEach(domConstruct.destroy);
                    query('.lite-viewer.map').forEach(domConstruct.destroy);
                    query('#legendWrapper .notice').forEach(domConstruct.destroy);
                    query('#subthemeButtonGroup div').forEach(domConstruct.destroy);
                    array.forEach(registry.toArray(), function (widget, i) {
                        if(widget.type == 'radio')
                            widget.destroyRecursive(true);
                    });
                    array.forEach(app.maps, function(v, i){
                        v.legend.destroyRecursive(true);
                    });
                    domConstruct.destroy("radioWrapper");
                    domStyle.set(query('#legendModal')[0], 'display', 'none');
                    domClass.add(query('#data-viewer')[0], 'active');
                    app.currentMap = app.dataViewer;
                }
            });

            getLayerIds();

            resizeMap();

            esri.config.defaults.io.proxyUrl = "http://services.asascience.com/Proxy/esriproxy/proxy.ashx";

            app.subthemeIndex = 0,
            app.searchResults = false;
        }

        function resizeMap()
        {
            app.screenHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            app.screenWidth = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
            app.headerOffset = query('.navbar-fixed-top').style('height')[0];
            if (app.lv) {
                app.headerOffset = app.headerOffset + 20;
            }
            app.sidePanelWidth = 281;
            app.mapHeight = app.screenHeight - app.headerOffset;

            query('.main').style({
                'height'        : (app.screenHeight - app.headerOffset) + 'px',
                'marginTop'    : app.screenWidth < 980 ? '0' : app.headerOffset + 'px'
            });
            query('.active.map').style({
               'height'        : app.mapHeight + 'px'
            });
        }

        function resizeSidePanel() {
            app.treeHeight = domStyle.get(app.sidePanel, 'height');
            var legendControl = domStyle.get(dom.byId('legend-control'), 'height'),
                removeButton = domStyle.get(dom.byId('remove-button-div'), 'height'),
                searchContainerHeight = domStyle.get(dom.byId('search-container'), 'height');
            if (navigator.userAgent.match(/rv:11.0/i) || navigator.userAgent.match(/MSIE/i)) {
                legendControl += 12,
                removeButton += 10;
                if (searchContainerHeight !== 0)
                    searchContainerHeight += 8;
            }
            app.searchContainerHeight = searchContainerHeight;
            app.treeHeight = app.treeHeight - legendControl - removeButton;
            if (!app.searchResults)
                app.treeHeight -= app.searchContainerHeight;
            if (app.legendVisible)
                app.treeHeight *= .5;
            dojo.query('#legend-dv').style('height', app.treeHeight + 'px');
            dojo.query('#tree').style('height', app.treeHeight + 'px');
            dojo.query('#layer-info').style('height', (app.treeHeight + app.searchContainerHeight) + 'px');
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
            
            template.layoutOptions.titleText = configOptions.themes[app.themeIndex].title + ' | ' + configOptions.themes[app.themeIndex].maps[app.subthemeIndex].title;
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
                                app.currentMap.setBasemap('oceans');
                                if (app.currentMap.chart.visible)
                                    app.currentMap.chart.hide();
                                if (app.lv) {
                                    array.forEach(app.maps, function(map){
                                        if (map !== app.currentMap) {
                                            map.setBasemap('oceans');
                                            if (map.chart.visible)
                                                map.chart.hide();
                                        }
                                    });
                                }
                                break;
                            case 'Satellite':
                                app.currentMap.setBasemap('satellite');
                                if (app.currentMap.chart.visible)
                                    app.currentMap.chart.hide();
                                if (app.lv) {
                                    array.forEach(app.maps, function(map){
                                        if (map !== app.currentMap) {
                                            map.setBasemap('satellite');
                                            if (map.chart.visible)
                                                map.chart.hide();
                                        }
                                    });
                                }
                                break;
                            case 'Chart':
                                app.currentMap.chart.show();
                                var basemapLayerID = app.currentMap.basemapLayerIds[0];
                                for (var prop in app.currentMap._layers)
                                    if (prop == basemapLayerID)
                                        app.currentMap._layers[prop].hide();
                                app.currentMap._basemap = 'chart';
                                if (app.lv) {
                                    array.forEach(app.maps, function(map){
                                        if (map !== app.currentMap) {
                                            map.chart.show();
                                            var basemapLayerID = map.basemapLayerIds[0];
                                            for (var prop in map._layers)
                                                if (prop == basemapLayerID)
                                                    map._layers[prop].hide();
                                            map._basemap = 'chart';
                                        }
                                    });
                                }
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
                        app.currentMap.centerAndZoom(new Point(this.lat, this.lon), this.level);
                        if (app.lv) {
                            array.forEach(app.maps, function(map){
                                if (map !== app.currentMap) {
                                   map.centerAndZoom(new Point(this.lat, this.lon), this.level);
                                }
                            });
                        }
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
            
        //     longUrl += baseUrl.replace('#', '') + pil +'&z=' + app.currentMap.getZoom() + '&b=' + app.currentMap._basemap + '&m=' + cm + '&r=' + radioSelection + '&x=' + point.x + '&y=' + point.y;

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
            createTree();

            app.dataViewer = new Map('data-viewer',{
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

            app.currentMap = app.dataViewer;

            app.currentMap.on('update-start', function(e) {
                dom.byId('loading').style.display ='block';
            });

            app.currentMap.on('update-end', function(e) {
                dom.byId('loading').style.display ='none';
                if (app.legend)
                    app.legend.refresh();
            });

            app.currentMap.chart = new ArcGISImageServiceLayer('http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');

            app.currentMap.addLayer(app.currentMap.chart, 1);
            app.currentMap.chart.hide();

            var scalebar = new Scalebar({
                map         : app.currentMap,
                attachTo    : 'bottom-right'
            });

            app.currentMap.on('load', function(){
                updateScale();
                query('#mapList .button-container').style({'visibility' : 'visible'});
                createBasemapGallery();
                domStyle.set(dom.byId('themeButtonGroup'), 'visibility', 'visible');
                domStyle.set(dom.byId('side-panel'), 'visibility', 'visible');
                domStyle.set(dom.byId('loading'), 'visibility', 'visible');
                resizeSidePanel();
            });

            dojo.byId()

            app.currentMap.on('layers-add-result', function () {
                app.legend = new Legend({
                    map         : app.currentMap
                }, 'legend-dv');
                app.legend.startup();
            });

            app.currentMap.on('zoom-end', function (e) {
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
                var width = '100%';
                if (app.sidePanelVisible) {
                    coreFx.slideTo({ node:  app.sidePanel, left: (domStyle.get(app.sidePanel, 'width') * -1), top: 0 }).play();
                    coreFx.slideTo({ node:  this.parentNode, left: 31, top: 0 }).play();
                    app.currentMap.resize(true);
                    app.sidePanelVisible = false;
                    domStyle.set(this, {
                        borderLeft  : '10px solid #D1D2D4',
                        borderRight : '0'
                    });
                    domAttr.set(this, 'title', 'Show Panel');
                }
                else {
                    coreFx.slideTo({ node:  app.sidePanel, left: 0, top: 0 }).play();
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
                if (app.legendVisible) {
                    app.treeHeight = app.treeHeight *2;
                    var expandTree = fx.animateProperty({
                        node: tree,
                        properties: {
                            height: app.treeHeight
                        }
                    });
                    var expandLayerInfo = fx.animateProperty({
                        node: layerInfo,
                        properties: {
                            height: app.treeHeight
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
                    app.treeHeight = app.treeHeight / 2;
                    var collapseTree = fx.animateProperty({
                        node: tree,
                        properties: {
                            height: app.treeHeight
                        }
                    });
                    var collapseLayerInfo = fx.animateProperty({
                        node: layerInfo,
                        properties: {
                            height: app.treeHeight
                        }
                    });
                    dojo.query('#legend-dv').style('height', app.treeHeight + 'px');
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

        // function getFullServices() {
        //     var requestCount = 0;
        //     array.forEach(app.fullServiceUrls, function (serviceUrl, mapIndex) {
        //         var request = EsriRequest({
        //             url: serviceUrl,
        //             content: {
        //                 f: "json"
        //             },
        //             handleAs: "json",
        //             callbackParamName: "callback"
        //         });

        //         request.then(
        //             function(result) {
        //                 result.url = app.fullServiceUrls[mapIndex];
        //                 result.documentInfo.Title = configOptions.comp_viewer.fullServices[mapIndex].title;
        //                 result.index = configOptions.comp_viewer.fullServices[mapIndex].index;
        //                 array.forEach(configOptions.comp_viewer.fullServices[mapIndex].layers, function (configLayer) {
        //                     array.forEach(result.layers, function (layer) {
        //                         if (layer.name === configLayer.name) {
        //                             layer.metadata = configLayer.metadata;
        //                             if (configLayer.external)
        //                                 layer.external = configLayer.external;
        //                             if (configLayer.noSource)
        //                                 layer.noSource = configLayer.noSource;
        //                             layer.index = configOptions.comp_viewer.fullServices[mapIndex].index;
        //                         }
        //                     });
        //                 });
        //                 app.fullServices.push(result);
        //                 requestCount++;
        //                 if (requestCount == app.fullServiceUrls.length)
        //                     createTree();
        //             }, function(error) {
        //                 console.log("Error: ", error.message);
        //         });
        //     });
        // }

        function createTree() {
            app.myStore = new Memory({getChildren: function (object) {
                    return this.query({parent: object.id});
                }
            });
            app.myStore.data.push({id: 'server', name: 'MapServers', root: true});

            // create layer group from config list
            array.forEach(configOptions.comp_viewer.groups, function (group, i) {
                app.myStore.data.push({
                    id          : group.title,
                    name        : group.title,
                    type        : 'mapserver',
                    parent      : 'server',
                    hasChildren : true
                });
                if (group.layers.length > 0) {
                    var subGroup = group.title;
                    array.forEach(group.layers, function (layer, j) {
                        if (layer.subGroup)
                            subGroup = layer.subGroup;
                        app.myStore.data.push({
                            name        : layer.label ? layer.label : layer.name,
                            type        : 'layer',
                            parent      : group.title,
                            hasChildren : false,
                            group       : group.title,
                            minScale    : (layer.minScale == 0) ? null : layer.minScale,
                            id          : layer.serviceURL + layer.id + '-',
                            tile        : layer.tile,
                            metadata    : layer.metadata,
                            realName    : layer.label ? layer.name : null,
                            external    : layer.external ? layer.external : null,
                            keyword     : layer.label ? layer.label : layer.name + ' ' + subGroup,
                            subGroup    : layer.subGroup ? layer.subGroup : null
                        });
                    });
                }
            });

            // create the model
            app.myModel = new ObjectStoreModel({
                store: app.myStore,
                query: {id: 'server'}
            });

            var treeItemCount = 0,
                firstCompLoad = true;

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
                onLoad: function () {
                    this.expandAll();
                },
                onOpen: function (item, node) {
                    if (!item.root) {
                        if (query('input[type="checkbox"]', node.domNode).length == 0) {
                            var groupName = item.id;
                            if (item.type === 'mapserver') {
                                var dataIndex = 0;
                                array.forEach(app.tree.model.store.data, function (v, i) {
                                    if (v.name == groupName && v.hasChildren) {
                                        dataIndex = i + 1;
                                        return false;
                                    }
                                });
                            }
                            array.forEach(query('.no-children', node.domNode), function (element, i) {
                                var checkboxId = app.tree.model.store.data[dataIndex].id.substr(0, app.tree.model.store.data[dataIndex].id.length-1),
                                    tile = app.tree.model.store.data[dataIndex].tile,
                                    subGroup = app.tree.model.store.data[dataIndex].subGroup,
                                    duplicate = false;
                                    dataIndex++;

                                if (registry.byId(checkboxId)) {
                                    checkboxId += 'duplicate';
                                    duplicate = true;
                                }

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
                                        checkboxChange(b, service, id, theme, tile, duplicate);
                                    }
                                }, checkboxId).startup();
                                domConstruct.place('<span role="presentation" class="dijitInline dijitIcon dijitTreeIcon dijitIconFile" data-dojo-attach-point="iconNode" title="Layer Information" data-service_layer="' + checkboxId + '"></span><div class="slider-container" data-service_layer="' + checkboxId + '"></div>', element, 'last');
                                if (subGroup) {
                                    domConstruct.place('<div class="subGroup">' + subGroup + '</div>', element, 'first');
                                }
                            });
                        }
                        checkMinScale();

                        treeItemCount++;
                        if (treeItemCount === app.myStore.data.length - 1 && firstCompLoad) {
                            app.tree.collapseAll();
                            dojo.query('#tree').show();
                            firstCompLoad = false;

                            on(query('.dijitIconFile'), 'click', function (e) {
                                dom.byId('loading').style.display = 'block';
                                var serviceUrl = e.target.attributes['data-service_layer'].value;
                                if (serviceUrl.match(/duplicate/))
                                    serviceUrl = serviceUrl.substr(0, serviceUrl.indexOf('duplicate'));
                                dojo.query('#tree, #search-container, #search-results-header').hide();
                                dojo.query('#layer-info').show();
                                resizeSidePanel();
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
                                        if (app.searchResults)
                                            returnSearchRows();
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
                                        contentHtml += sourceDataHtml + ' | <a href="' + serviceUrl + '" target="_blank">Web Service</a> | <a href="#" onClick="app.currentMap.centerAndZoom(new esri.geometry.Point(' + centerPoint.getLongitude() + ', ' + centerPoint.getLatitude() + '), 7);">Zoom to Layer</a>';
                                        dom.byId('loading').style.display = 'none';
                                        domConstruct.place(contentHtml + '</p></div>', dojo.byId('layer-info-content'), 'replace');
                                    }, function(error) {
                                        console.log("Error: ", error.message);
                                });
                            });
                        }
                    }
                }
            });
            app.tree.placeAt(dojo.byId('tree'));
            app.tree.startup();

            on(dom.byId('remove-layers'), 'click', function (e){
                e.preventDefault();
                array.forEach(registry.toArray(), function (widget, i) {
                    if(widget.type == 'checkbox')
                        if (widget.checked)
                            widget.set('checked', false);
                });
            });
            on(dom.byId('back-to-layers'), 'click', function (e) {
                e.preventDefault();
                if (app.searchResults)
                    returnSearchRows();
                dojo.query('#tree, #search-container').show();
                dojo.query('#layer-info').hide();
                app.searchResults = false;
                resizeSidePanel();
            });

            app.lastQueryResults = [];

            app.filteringSelect = new FilteringSelect({
                id: 'layer-select',
                store: app.myStore,
                required: false,
                autoComplete: false,
                searchDelay: 0,
                searchAttr : 'keyword',
                labelAttr : 'name',
                queryExpr : '*${0}*',
                style: {
                    width   : '232px',
                    height  : '25px'
                },
                placeHolder : 'Keyword',
                invalidMessage : 'no matching layers'
                ,
                onSearch    : function (r, q, o) {
                    app.lastQueryResults = [];
                    if (r.length > 0) {
                        r.forEach(function (v) {
                            if (v.type === 'layer')
                                app.lastQueryResults.push(v);
                        });
                    }
                },
                onKeyUp     : function (e) {
                    if (e.keyCode === 13)
                        on.emit(dom.byId('layer-search-button'), 'click', {bubbles: true, cancelable: true});
                },
                onChange    : function (newValue) {
                    if (newValue !== '') {
                        var checkboxId = newValue.substr(0, newValue.length-1);
                        domConstruct.place(dojo.query('input[name="' + checkboxId + '"]').parent().parent().parent()[0], dom.byId('search-results-header'), 'after');
                        showSearchResults();
                    }
                }
            }, 'layer-select').startup();

            on(dom.byId('layer-search-button'), 'click', function (e) {
                e.preventDefault();
                app.lastQueryResults.forEach(function (v, i) {
                    var layerUrl = v.id;
                    if (layerUrl.match(/duplicate/i))
                        layerUrl = layerUrl.substr(0, layerUrl.indexOf('duplicate'));
                    else
                        layerUrl = layerUrl.substr(0, layerUrl.length-1);
                    var row = dojo.query('div[widgetid="' + layerUrl + '"]').parent().parent()[0];
                    domConstruct.place('<div id="' + domAttr.get(row, 'id') + '-placeholder"></div>', row, 'after');
                    domConstruct.place(row, dom.byId('search-results-container'));
                });
                showSearchResults();
            });
        }

        function checkMinScale (level, minLevel) {
            var scale = app.currentMap.getScale();
            if (!level) {
                array.forEach(registry.toArray(), function (widget, i) {
                    if (widget.hasOwnProperty('item')) {
                        if (widget.item.hasOwnProperty('minScale')) {
                            if (widget.item.minScale != null) {
                                var checkboxWidget = registry.byId(widget.item.id.substr(0, widget.item.id.indexOf('-')));
                                if (widget.item.minScale < scale) {
                                    if (!checkboxWidget.get('disabled')) {
                                        checkboxWidget.set('disabled', true);
                                        domConstruct.place('<span class="zoom-notice" id="' + widget.item.id + 'zoom">zoom to view</span>', widget.domNode.childNodes[0]);
                                        dojo.setStyle(query('.slider-container[data-service_layer="' + widget.item.id.substr(0, widget.item.id.length-1) + '"]')[0], 'display', 'none');
                                    }
                                }
                                else
                                    if (checkboxWidget.get('disabled')) {
                                        checkboxWidget.set('disabled', false);
                                        domConstruct.destroy(widget.item.id + 'zoom');
                                        dojo.setStyle(query('.slider-container[data-service_layer="' + widget.item.id.substr(0, widget.item.id.length-1) + '"]')[0], 'display', 'inline-block');
                                    }
                            }
                        }
                    }

                });
            }
            else {
                if (level < minLevel)
                    domClass.add(query('.notice.' + configOptions.themes[app.themeIndex].maps[app.subthemeIndex].group)[0], 'active');
                else
                    domClass.remove(query('.notice.active.' + configOptions.themes[app.themeIndex].maps[app.subthemeIndex].group)[0], 'active');
            }
        }

        function updateScale() {
            dom.byId('scale').innerHTML = "Scale 1:" + app.currentMap.__LOD.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

        getLayerIds = function (liteViewer)
        {
            if (liteViewer) {
                if (!configOptions.themes[app.themeIndex].hasOwnProperty('loaded'))
                {
                    if (configOptions.themes[app.themeIndex].maps.length !== 0)
                    {
                        var dynamicLayerCount = 0,
                            requestCount = 0;
                        array.forEach(configOptions.themes[app.themeIndex].maps, function (map, mapIndex) {
                            if (map.layers.hasOwnProperty('dynamicLayers'))
                            {
                                array.forEach(map.layers.dynamicLayers, function (dynamicLayer, dynamicLayerIndex) {
                                    dynamicLayerCount++;
                                    var request = EsriRequest({
                                        url: dynamicLayer.URL + 'layers',
                                        content: {
                                            f: "json"
                                        },
                                        handleAs: "json",
                                        callbackParamName: "callback"
                                    });

                                    request.then(
                                        function(data) {
                                            requestCount++;
                                            array.forEach(data.layers, function (layerObj, i){
                                                array.forEach(dynamicLayer.layers, function (layer) {
                                                    if (layer.name === layerObj.name)
                                                    {
                                                        layer.ID = layerObj.id;
                                                        layer.description = layerObj.description;
                                                    }
                                                });
                                            });
                                            if (requestCount === dynamicLayerCount)
                                            {
                                                configOptions.themes[app.themeIndex].loaded = true;
                                                loadMainTheme(app.currentThemeIndex);
                                            }
                                        }, function(error) {
                                            console.log("Error: ", error.message);
                                    });
                                });
                            }
                        });
                    }
                }
                else
                    loadMainTheme(app.currentThemeIndex);
            }
            else {
                app.layersLoaded = 0,
                app.layersUnloaded = 0;
                app.mapservers = 0;
                app.mapserverResponse = 0;
                array.forEach(configOptions.comp_viewer.groups, function (group, groupIndex) {
                    app.layersUnloaded += group.layers.length;
                    app.mapservers += group.serviceURLs.length;
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
                                app.mapserverResponse++;
                                array.forEach(data.layers, function (layerObj, i) {
                                    array.forEach(group.layers, function (layer, j) {
                                        if (layer.serviceURL === serviceURL && layer.name === layerObj.name.trim() && (layer.parent === undefined || layer.parent === layerObj.parentLayer.name))
                                        {
                                            layer.id            = layerObj.id,
                                            layer.description   = layerObj.description,
                                            layer.minScale      = layerObj.minScale;
                                            app.layersLoaded++;
                                            if (app.layersLoaded === app.layersUnloaded) {
                                                createMap();
                                            }
                                        }
                                    });
                                });
                                if (app.mapservers === app.mapserverResponse) {
                                    var invalidLayers = [];
                                    configOptions.comp_viewer.groups.forEach(function(g){
                                        g.layers.forEach(function(l){
                                            if (l.id === undefined) {
                                                invalidLayers.push(l);
                                                console.log('***LAYER ERROR***');
                                                console.log(l);
                                            }
                                        });
                                    });
                                    if (invalidLayers.length > 0) {
                                        configOptions.comp_viewer.groups.forEach(function (g) {
                                            var validLayers = [];
                                            g.layers.forEach(function (groupLayer) {
                                                var valid = true;
                                                invalidLayers.forEach(function (invalidLayer) {
                                                    if (groupLayer === invalidLayer)
                                                        valid = false;
                                                });
                                            if (valid)
                                                validLayers.push(groupLayer);
                                            });
                                            g.layers = validLayers;
                                        });
                                        createMap();
                                    }
                                }
                            }, function(error) {
                                console.log("Error: ", error.message);
                        });
                    });
                });
            }
        }

        checkboxChange = function (b, service, id, theme, tile, duplicate) {
            var layerId = service + id;
            if (b) {
                if (theme) {
                    if (tile)
                        var layer = new ArcGISTiledMapServiceLayer(service, {id : layerId});
                    else {
                        var layer = new ArcGISDynamicMapServiceLayer(service, {id : layerId});
                        layer.setVisibleLayers([id]);
                    }
                }
                else
                    var layer = new ArcGISDynamicMapServiceLayer(app.serverUrl + service + '/MapServer', {id : service});

                app.currentMap.addLayers([layer]);

                if (duplicate)
                    layerId += 'duplicate';

                var sliderContainer = query('.slider-container[data-service_layer="' + layerId + '"]')[0];
                domConstruct.place('<div></div>', sliderContainer);

                var slider = new HorizontalSlider({
                    name                : 'slider_' + layerId,
                    value               : 10,
                    minimum             : 0,
                    maximum             : 10,
                    discreteValues      : 1,
                    intermediateChanges : true,
                    style               : 'width: 75px;',
                    onChange            : function(value){
                        layer.setOpacity(value*.1);
                        app.legend.refresh();
                    }
                }, query('.slider-container[data-service_layer="' + layerId + '"] div')[0]);
                slider.startup();
            }
            else {
                app.currentMap.removeLayer(app.currentMap._layers[layerId]);
                if (duplicate)
                    layerId += 'duplicate';
                array.forEach(registry.toArray(), function (widget, i) {
                    if(widget.name === 'slider_' + layerId)
                        widget.destroy();
                });
            }
        }

        loadMainTheme = function (themeIndex)
        {
            dojo.byId('loading').style.display = 'block';
            query('.legendDiv').forEach(domConstruct.destroy);
            query('.lv-map').forEach(domConstruct.destroy);
            query('#timeSliderDiv').style('display', 'none');
            domConstruct.destroy("radioWrapper");

            if (domStyle.get(app.sidePanel, 'display') === 'block') {
                behavior.add({
                    '.esriLegendService' : {
                        found: function(){updateLegend();}
                    }
                });

                var notifyCount = 0;

                notify('done',function(responseOrError){
                    if (responseOrError.hasOwnProperty('url'))
                        if (responseOrError.url.match(/legend?/i))
                        {
                            notifyCount++;
                            if (notifyCount === configOptions.themes[app.themeIndex].maps.length) {
                                notifyCount = 0;
                                behavior.apply();
                            }
                        }
                });

                domStyle.set(app.sidePanel, 'display', 'none');
                domStyle.set('data-viewer', 'display', 'none');
                dojo.query('.lv').style({'display' : 'block'});
                domClass.remove('data-viewer', 'active');

                //query('#mapCarousel').carousel({interval: false});

                // query('#mapCarousel button').on('click', function (e){
                //     query('#loading').style("display", "block");
                //     domClass.remove(query('#mapCarousel button.btn.active')[0], 'active');
                //     domClass.add(query(e.target), 'active');
                //     app.themeIndex = parseInt(e.currentTarget.id.substring(e.currentTarget.id.length - 1), 10);
                //     getLayerIds();
                // });

                if (app.screenWidth < 1024)
                    domClass.remove("legendButton", "active");
                else
                    query('#legendModal').style({
                        'display'   : 'block',
                        'top'       : '100px',
                        'left'      : '65px'
                    });

                if (app.firstLV_load) {
                    var constraintBox = {
                        l:  0,
                        t:  63,
                        w:  app.screenWidth,
                        h:  app.mapHeight
                    };

                    var moveableLegend =  new move.constrainedMoveable("legendModal", {
                        within: true,
                        handle: query('#legendModal .modal-header'),
                        constraints: function(){return constraintBox;}
                    });

                    query('#legendModal .modal-header button.close').on('click', function (e){
                        domAttr.set(query('#side-tabs img:eq(0)')[0], 'src', 'img/side-buttons/legend-tab-out-off.png');
                        fadeOutLegend.play();
                    });

                    query('#legendModal').modal({show : false});

                    var fadeInLegend = fx.fadeIn({node:'legendModal'});
                    var fadeOutLegend = fx.fadeOut({node:'legendModal'});

                    on(fadeOutLegend, 'End', function(){
                        query('#legendModal').style('display', 'none');
                    });

                    on(fadeInLegend, 'End', function(){
                        query('#legendModal').style('display', 'block');
                    });

                    query('#legend-tab').on('click', function (e){
                        if (query('#legendModal').style('display') == 'none') {
                            domAttr.set(query('#side-tabs img:eq(0)')[0], 'src', 'img/side-buttons/legend-tab-out-on.png');
                            query('#legendModal').style('display', 'block');
                            fadeInLegend.play();
                        }
                        else {
                            domAttr.set(query('#side-tabs img:eq(0)')[0], 'src', 'img/side-buttons/legend-tab-out-off.png');
                            fadeOutLegend.play();
                        }
                    });

                    // query('.btn').on('click', function (e){
                    //     focusUtil.curNode && focusUtil.curNode.blur();
                    // });

                    // on(query('#themeButtonGroup button'), 'click', function (e){
                    //     query('#loading').style("display", "block");
                    //     app.themeIndex = parseInt(e.currentTarget.id.substring(e.currentTarget.id.length - 1), 10);
                    //     getLayerIds(app.lv);
                    // });

                    on(query('#printButton'), 'click', function (e){
                        query(e.target).button('loading');
                        print();
                    });
                    app.firstLV_load = false;
                }

                updateAboutText(0);
            }

            app.subthemeIndex = themeIndex;
            //updateAboutText(app.subthemeIndex);
            app.maps = [];

            createSubThemeButtons();

            array.forEach(configOptions.themes[app.themeIndex].maps, function(map, mapIndex){
                // place map div in map-pane
                domConstruct.place('<div id="map' + mapIndex + '" class="map-pane lite-viewer' + ((mapIndex == 0) ? ' active"' : '"') + '></div>', 'map-container');
                // create map
                var mapDeferred = new Map('map' + mapIndex,{
                    basemap                 : 'oceans',
                    zoom                    : 7,
                    minZoom                 : 7,
                    maxZoom                 : 14,
                    logo                    : false,
                    nav                     : false,
                    sliderStyle             : 'small',
                    showInfoWindowOnClick   : false,
                    center                  : [-70.5, 42],
                    showAttribution         : false,
                    sliderPosition          : 'top-left'
                });

                app.maps.push(mapDeferred);

                mapDeferred.layers = [];

                var layerInfo = [];

                var visibleLayers = [];

                if (map.layers.hasOwnProperty("dynamicLayers")) {
                    array.forEach(map.layers.dynamicLayers, function (dynamicLayer, i) {
                        var dl = new ArcGISDynamicMapServiceLayer(dynamicLayer.URL);
                        mapDeferred.layer = dl;
                        array.forEach(dynamicLayer.layers, function (layer, layerIndex) {
                            if (layer.hasOwnProperty("checked")) {
                                if (layerIndex === 0)
                                     dojo.place("<div id='radioWrapper'></div>", "legendWrapper");
                                //dojo.place("<input type='radio' name='radio-buttons' id='radio_" + layer.ID + "' data-id='" + layer.ID + "'" + 
                                //(layer.checked ? 'checked' : '') + " /><label for='radio_" + layer.ID + "'>" + layer.name + "</label><br />", "radioWrapper");

                                radio = new dijit.form.RadioButton({
                                    id          : 'radio_' + layer.ID,
                                    label       : layer.name,
                                    value       : layer.ID,
                                    name        : 'radio-buttons', //layer[i].group,
                                    //'class'     : layer[i].group,
                                    checked     : layer.checked,
                                    onClick     : function(e) {radioClick(this.value);
                                                  }
                                }, dojo.create('input', null, dojo.byId('radioWrapper')));
                                dojo.create('label', { 'for' : 'radio_' + layer.ID , innerHTML : layer.name, 'class' : 'radio-buttons' }, dojo.byId('radioWrapper'));


                                if (layer.checked)
                                    visibleLayers.push(layer.ID)
                            }
                            else
                                visibleLayers.push(layer.ID);
                            if (layer.hasOwnProperty("showtimeSlider"))
                            {
                                var tsDiv = dojo.create("div", null, dojo.byId('timeSliderDiv'));
                                var timeSlider = new esri.dijit.TimeSlider({
                                    style: "padding-top:10px;padding-bottom:10px;",
                                    id: 'timeSlider'
                                }, tsDiv);

                                mapDeferred.setTimeSlider(timeSlider);

                                timeSlider.setThumbCount(1);
                                var timeExtent = new esri.TimeExtent();
                                timeExtent.startTime = new Date("2/1/2012 UTC");
                                timeExtent.endTime = new Date("12/01/2012 UTC");
                                timeSlider.singleThumbAsTimeInstant(true);
                                timeSlider.createTimeStopsByTimeInterval(timeExtent, 1, 'esriTimeUnitsMonths');

                                var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                "Jul", "Aug", "Sep", "Oct", "Nov"];

                                timeSlider.setLabels(monthNames);
                                timeSlider.startup();
                                query('#timeSliderDiv').style('display', 'block');
                            }

                            if (layer.hasOwnProperty("outField"))
                            {
                                var fl = new FeatureLayer(dynamicLayer.URL + layer.ID, {
                                    infoTemplate : new InfoTemplate('', '${' + layer.outField + '}'),
                                    outFields: [layer.outField],
                                    opacity: 0.0,
                                    displayOnPan: false
                                });
                                fl.on('mouse-over', function (e){
                                    var g = e.graphic;
                                    app.currentMap.infoWindow.setTitle(g._graphicsLayer.name);
                                    app.currentMap.infoWindow.setContent(g.getContent());
                                    app.currentMap.infoWindow.show(e.screenPoint, app.currentMap.getInfoWindowAnchor(e.screenPoint));
                                });
                                fl.on('mouse-out', function (e){
                                    app.currentMap.infoWindow.hide();
                                });
                                mapDeferred.addLayer(fl);
                            }
                        });
                        dl.setVisibleLayers(visibleLayers);
                        // map.flexLink = 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;admin=9999;hapc=9999;efh=9999;ngdc=9999;ocean=9999';
                        // array.forEach(visibleLayers, function (layerID) {
                        //     map.flexLink += (',' + layerID);
                        // });
                        // map.flexLink += ';HereIsMyMap#';
                        // if (mapIndex === 0)
                            // query('#flex-link')[0].href = map.flexLink;
                        mapDeferred.addLayers([dl]);
                    });
                }

                mapDeferred.on('layers-add-result', function (e){
                    array.forEach(e.layers, function (layer){
                        layerInfo.push({layer: layer.layer});
                    });
                    createLegend(layerInfo, mapIndex);
                });

                mapDeferred.on('extent-change', function (e){
                    if (mapDeferred.loaded && mapDeferred === app.currentMap) {
                        query('#scale')[0].innerHTML = "Scale 1:" + e.lod.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        array.forEach(app.maps, function(thisMap, index){
                            if (thisMap !== app.currentMap)
                                thisMap.setExtent(e.extent);
                        });
                    }
                });

                 mapDeferred.on('zoom-end', function (e){
                    if (mapDeferred.loaded && mapDeferred === app.currentMap) {
                        if (configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction) {
                            var minLevel = configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction.minLevel;
                            if ((e.level >= minLevel && app.oldZoomLevel < minLevel) || (e.level < minLevel && app.oldZoomLevel >= minLevel)) {
                                checkMinScale(e.level, minLevel);
                                app.currentMap.legend.refresh();
                                behavior.apply();
                            }
                        }
                        // //updateNotice();
                        // if (app.subthemeIndex === 0){
                        //     if (e.level >= 12 && app.oldZoomLevel < 12 || app.oldZoomLevel === 14) {
                        //         app.currentMap.legend.refresh();
                        //         behavior.apply();
                        //     }
                        //     else if (e.level < 12 && app.oldZoomLevel >= 12) {
                        //         app.currentMap.legend.refresh();
                        //         behavior.apply();
                        //     }
                        //     if (e.level === 14)
                        //     {
                        //         app.currentMap.legend.refresh();
                        //         behavior.apply();
                        //     }
                        // }
                        // else if (app.subthemeIndex === 1) {
                        //     if (e.level >= 10 && app.oldZoomLevel < 10) {
                        //         app.currentMap.legend.refresh();
                        //         behavior.apply();
                        //     }
                        //     else if (e.level < 10 && app.oldZoomLevel >= 10) {
                        //         app.currentMap.legend.refresh();
                        //         behavior.apply();
                        //     }
                        // }
                        // if (e.level == 14) {
                        //      var point = new esri.geometry.Point(app.currentMap.getCenter());
                        //      if (point.x > -7754990.997596861) {
                        //          if (osmLayer == null) {
                        //              osmLayer = new esri.layers.OpenStreetMapLayer();
                        //              app.currentMap.addLayer(osmLayer, 1);
                        //          }
                        //          else
                        //              osmLayer.show();
                        //      }
                        //         else
                        //             if (osmLayer != null)
                        //              osmLayer.hide();
                        //     }
                        // else if (osmLayer != null)
                        //     osmLayer.hide();
                        app.oldZoomLevel = e.level;
                     }
                 });


                mapDeferred.on('update-start', function(){
                    if (mapDeferred.loaded && mapDeferred === app.currentMap)
                        query('#loading').style("display", "block");
                });

                mapDeferred.on('update-end', function(){
                    if (mapDeferred.loaded && mapDeferred === app.currentMap)
                        //share();
                        query('#loading').style("display", "none");
                });

                if (mapIndex == 0)
                    app.currentMap = mapDeferred;

                mapDeferred.chart = new ArcGISImageServiceLayer('http://seamlessrnc.nauticalcharts.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');

                mapDeferred.addLayer(mapDeferred.chart, 1);
                mapDeferred.chart.hide();

                var scalebar = new Scalebar({
                    map         : mapDeferred,
                    attachTo    : 'bottom-right'
                });

                mapDeferred.on('load', function(){
                    if (mapDeferred === app.currentMap)
                        query('#scale')[0].innerHTML = "Scale 1:" + mapDeferred.__LOD.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                });
            });

            app.oldZoomLevel = app.currentMap.getLevel();

            var menuWidth = configOptions.themes[app.themeIndex].maps[app.subthemeIndex].menuWidth;
            query('#legendModal').style('width', menuWidth + 'px');
            //query('#legend-lv').style('width', (menuWidth + 2) + 'px');
            query('#flex-link')[0].href = configOptions.themes[app.themeIndex].maps[app.subthemeIndex].flexLink;
        }

        createSubThemeButtons = function ()
        {
            domConstruct.destroy("subbuttons");
            // var subThemes = '<div class="button-container" id="subbuttons"><div class="btn-group sub-theme-buttons" data-toggle="buttons-radio">';
            var subThemes = '';
            array.forEach(configOptions.themes[app.themeIndex].maps, function (map, i){
                subThemes += '<div id="subThemeButton' + i + '" class="theme_' + app.themeIndex + (i === 0 ? ' active-subtheme' : '') + '">' + map.title + '</div>';
            });
            //subThemes += '</div></div>';
            // domConstruct.place(subThemes, 'subthemeButtonGroup');
            domConstruct.place(subThemes, 'subthemeButtonGroup');

            on(query('#subthemeButtonGroup div'), 'click', function (e){
                domClass.remove(query('#subthemeButtonGroup .active-subtheme')[0], 'active-subtheme');
                domClass.add(this, 'active-subtheme');
                changeSubTheme(parseInt(e.currentTarget.id.substring(e.currentTarget.id.length - 1), 10));        
            });

            app.subThemeButtonWidth = 0;
            array.forEach(query('#subthemeButtonGroup div'), function (v, i) {
                app.subThemeButtonWidth += domStyle.get(v, 'width');
                app.subThemeButtonWidth++; //to account for 1px right padding
            });
            domStyle.set(dojo.byId('subthemeButtonGroup'), 'width', app.subThemeButtonWidth + 'px');
        }

        changeSubTheme = function (mapIndex)
        {
            var currentMapIndex = app.subthemeIndex;

            var fadeOutLayers = fx.fadeOut({node:'map' + app.subthemeIndex}),
                fadeOutLegend = fx.fadeOut({node: 'legendDiv' + app.subthemeIndex}),
                fadeInLayers = fx.fadeIn({node:'map' + mapIndex});
                fadeInLegend = fx.fadeIn({node: 'legendDiv' + mapIndex});
                //fadeOutRadio = fx.fadeOut({node: 'radioWrapper'}),
                //fadeInRadio = fx.fadeIn({node: 'radioWrapper'});

            on(fadeOutLayers, 'End', function(){
                domClass.remove('map' + currentMapIndex, 'active');
            });

            on(fadeInLayers, 'End', function(){
                domClass.add('map' + mapIndex, 'active');
            });

            // on(fadeInRadio, 'End', function (){
            //     query('#radioWrapper').style('display', 'block');
            // });

            // on(fadeOutRadio, 'End', function (){
            //     query('#radioWrapper').style('display', 'none');
            // });

            coreFx.combine([fadeOutLayers, fadeOutLegend, fadeInLayers, fadeInLegend]).play();


            domClass.remove('legendDiv' + currentMapIndex, 'active');
            domClass.add('legendDiv' + mapIndex, 'active');

            var menuWidth = configOptions.themes[app.themeIndex].maps[mapIndex].menuWidth;

            query('#legendModal').style('width', menuWidth + 'px');
            //query('#legend-lv').style('width', (menuWidth + 2) + 'px');

            if (configOptions.themes[app.themeIndex].maps[mapIndex].hasRadioBtns) {
                domClass.add('radioWrapper', 'active');
                //fadeInRadio.play();

            }
            else {
                if (domClass.contains('radioWrapper', 'active')) {
                    domClass.remove('radioWrapper', 'active');
                    //fadeOutRadio.play();
                }
            }

            updateAboutText(mapIndex);

            if (query('.notice.active')[0])
                domClass.remove(query('.notice.active')[0], 'active');
            if (configOptions.themes[app.themeIndex].maps[mapIndex].scaleRestriction) {
                domClass.add(query('.' + configOptions.themes[app.themeIndex].maps[mapIndex].group)[0], 'active');
            }

            app.subthemeIndex = mapIndex;
            app.currentMap = app.maps[mapIndex];
            app.currentMap.legend.refresh();
            behavior.apply();
            if (configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction)
                checkMinScale(app.currentMap.getLevel(), configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction.minLevel)

            if (configOptions.themes[app.themeIndex].maps[mapIndex].flexLink)
                query('#flex-link')[0].href = configOptions.themes[app.themeIndex].maps[mapIndex].flexLink;

            query('#legendAbout p').text(configOptions.themes[app.themeIndex].title + ': ' + configOptions.themes[app.themeIndex].maps[mapIndex].title);
        }

        updateAboutText = function (subthemeIndex)
        {
            query('#overview p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.overview;
            query('#data-considerations p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.dataConsiderations;
            query('#status p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.status +
                "<br><br>For information about how these data and maps are being developed with stakeholder input and used to support regional ocean planning, please visit the <a href='http://neoceanplanning.org/projects/maritime-commerce/' target='_blank'>maritime commerce</a> page on the Northeast Regional Planning Body's website.";
        }

        createLegend = function (layerInfos, i)
        {
            var noticeHTML = '';
            if (configOptions.themes[app.themeIndex].maps[i].scaleRestriction){
                noticeHTML = "<div class='" + configOptions.themes[app.themeIndex].maps[i].group + (i === 0 ? ' active' : '') +
                " notice'>Zoom in to view '" + configOptions.themes[app.themeIndex].maps[i].scaleRestriction.text + "'</div>";
            }
            var legendContentDiv = query('#legendWrapper')[0];
            var legendDivHTML = (noticeHTML + '<div id="legendDiv' + i + '" class="legendDiv' + (i == 0 ? ' active"' : '"') + '></div>');
            domConstruct.place(legendDivHTML, legendContentDiv);
            var legend = new Legend({
                map         : app.maps[i],
                layerInfos  : layerInfos,
                autoUpdate  : false
            }, 'legendDiv' + i);
            legend.startup();
            app.maps[i].legend = legend;
            if (i === 0)
                query('#legendAbout p').text(configOptions.themes[app.themeIndex].title + ': ' + configOptions.themes[app.themeIndex].maps[i].title);
        }

        updateLegend = function ()
        {
            array.forEach(configOptions.themes[app.themeIndex].maps, function (map){
                if (map.layers.hasOwnProperty("dynamicLayers"))
                    array.forEach(map.layers.dynamicLayers, function (dynamicLayer) {
                        array.forEach(dynamicLayer.layers, function (layer, i) {
                            var td = query('#legend-lv .esriLegendService div table.esriLegendLayerLabel tr td:contains("' + layer.name + '")')
                            if (td.text() == layer.name)td.html('<a href="' + layer.metadata + '" target="_blank" rel="tooltip" data-toggle="tooltip" data-placement="right" title="' + layer.description +  ' <br /><br />click link for metadata">' + layer.name + '</a>');
                        });
                    });
            });
            query('.esriLegendService').tooltip({selector: 'a[rel="tooltip"]'});
        }

        radioClick = function (id)
        {
            app.currentMap.layer.setVisibleLayers([id]);
            radioSelection = id;
            app.currentMap.legend.refresh();
            behavior.apply();
            array.forEach(configOptions.themes[app.themeIndex].maps[app.subthemeIndex].layers.dynamicLayers[0].layers, function (v, i) {
                if (v.ID === id)
                    query('#flex-link')[0].href = v.flexLink;
            });
        }

        returnSearchRows = function () {
            query('.dijitTreeNode', dom.byId('layer-info')).forEach(function (v, i) {
                var treeNodeID = domAttr.get(v, 'id');
                domConstruct.place(v, dom.byId(treeNodeID + '-placeholder'), 'before');
                domConstruct.destroy(dom.byId(treeNodeID + '-placeholder'));
            });
        }

        showSearchResults = function () {
            var layerInfoHeight = domStyle.get(dom.byId('layer-info'), 'height') + 36.5;
            domStyle.set(dom.byId('layer-info'), 'height', layerInfoHeight + 'px');
            dojo.query('#layer-info, #search-results-header').show();
            dojo.query('#tree, #search-container').hide();
            dom.byId('layer-info-content').innerHTML = '';
            app.searchResults = true;
            app.treeHeight += app.searchContainerHeight;
            resizeSidePanel();
            dojo.byId('layer-select').value = '';
        }

        return {
            init: init
        }
    }
);