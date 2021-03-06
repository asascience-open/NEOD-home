var app = {};
app.themeIndex = 0,
app.timeSlider = [],
app.lastSubTheme = 0,
app.sidePanelVisible = true,
app.legendIn = true,
app.layerInfos = [],
app.lv = false,
app.firstLV_load = true,
app.url = window.location.href,
app.shareUrl = '',
app.shareObj = {},
app.timeout = 6000,
app.setMap = false,
app.mutationCount = 0,
app.noCarousel = true;
define([
    'esri/map',
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
    'dojo/request',
    'dojo/fx',
    'dojo/_base/fx',
    'dojo/_base/array',
    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/mouse',
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
    'bootstrap/Modal',
    'bootstrap/Tab',
    'dojo/domReady!'
    ], 
    function(
        Map,
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
        dojoRequest,
        coreFx,
        fx,
        array,
        dom,
        domAttr,
        domStyle,
        mouse,
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
            app.MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

            app.observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.target.className === 'esriLegendService') {
                        app.mutationCount++;
                        if (app.mutationCount === app.dynamicLegends) {
                            updateLegend();
                            app.mutationCount = 0;
                        }
                    }
                });
            });

            // create buttons for each theme
            array.forEach(configOptions.themes, function (theme, themeIndex){
                domConstruct.place('<div><p onclick="themeClick(this);" ' + (themeIndex === (configOptions.themes.length - 1) ? ' class="active-theme"' : '') + ' data-theme-id="' + themeIndex + '">' + theme.title.toUpperCase() + '</p></div>', 'theme-button-container');
            });

            app.navbar = dom.byId('navbar'),
            app.sidePanel = dom.byId('side-panel');

            getLayerIds();

            resizeMap();

            app.constraintBox = {
                l:  0,
                t:  63,
                w:  app.screenWidth,
                h:  app.mapHeight
            };

            esri.config.defaults.io.proxyUrl = "http://services.asascience.com/Proxy/esriproxy/proxy.ashx";

            app.subthemeIndex = 0,
            app.searchResults = false;
        }

        function resizeMap()
        {
            app.screenHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            app.screenWidth = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
            app.headerOffset = query('.navbar-fixed-top').style('height')[0];
            app.sidePanelWidth = 281;
            app.mapHeight = app.screenHeight - app.headerOffset;

            query('.main').style({
                'height'        : (app.screenHeight - app.headerOffset) + 'px',
                'marginTop'    : app.screenWidth < 980 ? '0' : app.headerOffset + 'px'
            });
            
            domStyle.set('theme-button-container', 'width', (app.screenWidth - 175) + 'px');

            if (!app.lv && app.dataViewer)
                app.dataViewer.resize();
            
            query('.active.map').style({
               'height'        : app.mapHeight + 'px'
            });

            if (app.noCarousel) {
                $('.theme-carousel').slick({
                  ininite: true,
                  variableWidth: true,
                  slidesToShow: 10,
                  slidesToScroll: 2,
                  arrows: true
                });
                app.noCarousel = false;
            }
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
            if (app.legendIn) {
                app.treeHeight *= .5;
                dojo.query('#legend-dv').style('height', app.treeHeight + 'px');
            }
            dojo.query('#tree').style('height', app.treeHeight + 'px');
            dojo.query('#layer-info').style('height', (app.treeHeight + app.searchContainerHeight) + 'px');
        }

        window.onresize = function(event) {
            resizeMap();
            resizeSidePanel();
        };

        function print() 
        {
            dom.byId('loading').style.display ='block';
            var params = new PrintParameters();
            var template = new PrintTemplate();

            var legendLayers = [];
            var activeLayerIds = getActiveLayerIds();
            
            activeLayerIds.forEach(function (layerId) {
                var legendLayer = new LegendLayer();
                legendLayer.layerId = layerId;
                legendLayers.push(legendLayer);
            });

            template.format = "png32";          
            template.layout = "A3 Landscape";           
            template.preserveScale = false;
            template.layoutOptions = {};
            
            if (app.lv)
            template.layoutOptions.titleText = configOptions.themes[app.themeIndex].title + ' | ' + configOptions.themes[app.themeIndex].maps[app.subthemeIndex].title;
            else
                template.layoutOptions.titleText = 'Data Viewer';

            template.layoutOptions.authorText = 'Northeast Ocean Data Portal';
            template.layoutOptions.legendLayers = legendLayers;

            params.template = template;
            params.map = app.currentMap;

            var printTask = new PrintTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task", params);

            printTask.execute(params, function printTaskCallback(result) {
                window.open(result.url);
                dom.byId('loading').style.display ='none';
                dijit.byId('printButton').set('disabled', false);
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
                    var longUrl = window.location.origin + window.location.pathname + '?' + app.shareUrl;
                    dojoRequest.get('http://api.bit.ly/v3/shorten?apiKey=R_3802a64a9ae967439f44d5aebe7eabb8&login=ssontag&format=json&longUrl=' + longUrl, {
                        headers: {
                            'X-Requested-With': null
                        }
                    }).then(function (data) {
                            var url = JSON.parse(data).data.url;
                            dojo.query('#shareModal').modal('show');
                            dojo.query('#url').html('<a href="' + url + '">' + url + '</a>');
                    });
                }
            }, "shareButton").startup();

            var printButton = new Button({
                label: 'Print',
                onClick: function() {
                    this.set('disabled', true);
                    print();
                }
            }, "printButton").startup();
        }

        function share()
        {
            var shareObj = {
                point       :   new esri.geometry.Point(app.currentMap.extent.getCenter()),
                zoom        :   app.currentMap.getLevel(),
                basemap     :   app.currentMap._basemap
            };
            if (app.lv) {
                shareObj.themeIndex = app.themeIndex,
                shareObj.subthemeIndex = app.subthemeIndex;
                if (configOptions.themes[app.themeIndex].maps[app.subthemeIndex].hasRadioBtns)
                    shareObj.radioSelection = app.radioSelection;
            }
            else
                shareObj.layerIds = getActiveLayerIds();

            app.shareUrl = JSON.stringify(shareObj);
        }

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
                    autoResize              : false
                });

            app.currentMap = app.dataViewer;

            app.currentMap.on('update-start', function(e) {
                dom.byId('loading').style.display ='block';
            });

            app.currentMap.on('update-end', function(e) {
                dom.byId('loading').style.display ='none';
                if (app.legend)
                    app.legend.refresh();
                if (!app.setMap)
                    share();
            });

            app.currentMap.chart = new ArcGISImageServiceLayer('http://seamlessrnc.nauticalcharts.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');

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
                app.sidePanel.style.visibility = 'visible';
                dom.byId('watermark').style.display = 'block';
                domStyle.set(dom.byId('loading'), 'visibility', 'visible');
                resizeSidePanel();
                app.legend = new Legend({map: app.currentMap}, 'legend-dv');
                app.legend.startup();
            });

            dojo.byId()

            app.currentMap.on('layer-remove', share);

            app.currentMap.on('zoom-end', function (e) {
                checkScale();
                updateScale();
            })

            // query('#shareButton').on('click', function (e){
            //     query('#shareModal').modal('show');
            //     //share();
            // });

            // query('.btn').on('click', function (e){
            //     focusUtil.curNode && focusUtil.curNode.blur();
            // });

            on(dom.byId('show-hide-btn'), 'click', function (e){
                var width = '100%';
                if (app.sidePanelVisible) {
                    var sidePanelWidth = domStyle.get(app.sidePanel, 'width');
                    var hideSidePanel = coreFx.slideTo({ node:  app.sidePanel, left: sidePanelWidth * -1, top: 0 });
                    var slideWatermarkLeft = fx.animateProperty({ node:  dom.byId('watermark'), properties : { left : 9}});
                    coreFx.combine([hideSidePanel, slideWatermarkLeft]).play();
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
                    var showSidePanel = coreFx.slideTo({ node:  app.sidePanel, left: 0, top: 0 });
                    var slideWatermarkRight = fx.animateProperty({ node:  dom.byId('watermark'), properties : { left : 315}});
                    coreFx.combine([showSidePanel, slideWatermarkRight]).play();
                    app.sidePanelVisible = true;
                    domStyle.set(this, {
                        borderRight : '10px solid #D1D2D4',
                        borderLeft  : '0'
                    });
                    coreFx.slideTo({ node:  this.parentNode, left: 0, top: 0 }).play();
                    domAttr.set(this, 'title', 'Hide Panel');
                }
            });

            var moveableLegendDV =  new move.constrainedMoveable("legendModal-dv", {
                within: true,
                handle: query('#legendModal-dv .modal-header'),
                constraints: function(){return app.constraintBox;}
            });

            query('#legendModal-dv, #layerInfoModal').modal({show : false});

            var fadeInLegendDV = fx.fadeIn({node:'legendModal-dv'}),
                fadeOutLegendDV = fx.fadeOut({node:'legendModal-dv'});

            on(fadeOutLegendDV, 'End', function(){
                domStyle.set(dom.byId('legendModal-dv'),'display', 'none');
                domConstruct.place(dom.byId('legend-dv'), dom.byId('tree'), 'after');
            });

            query('#legendModal-dv .modal-header button.close').on('click', function (e){
                on.emit(dom.byId('show-hide-legend-btn'), 'click', {bubbles: true, cancelable: true});
            });

            on(dom.byId('show-hide-legend-btn'), 'click', function (e) {
                var tree = dom.byId('tree'),
                    layerInfo = dom.byId('layer-info');
                if (app.legendIn) {
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

                    domConstruct.place(dom.byId('legend-dv'), query('#legendModal-dv .modal-body')[0]);
                    domStyle.set(dom.byId('legendModal-dv'), 'display', 'block');
                    coreFx.combine([expandTree, expandLayerInfo, fadeInLegendDV]).play();
                    app.legendIn = false;
                    domStyle.set(this, {
                        borderRight  : '10px solid #D1D2D4',
                        borderLeft   : '0'
                    });
                    domAttr.set(this, 'title', 'Show Legend');
                    setIndices(e, 'legendModal-dv');
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
                    coreFx.combine([collapseTree, collapseLayerInfo, fadeOutLegendDV]).play();

                    app.legendIn = true;
                    domStyle.set(this, {
                        borderLeft : '10px solid #D1D2D4',
                        borderRight  : '0'
                    });
                    domAttr.set(this, 'title', 'Hide Legend');
                }
            });
        }

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
                            maxScale    : (layer.maxScale == 0) ? null : layer.maxScale,
                            id          : layer.serviceURL + layer.id + '-',
                            tile        : layer.tile,
                            metadata    : layer.metadata,
                            realName    : layer.label ? layer.name : null,
                            external    : layer.external ? layer.external : null,
                            keyword     : (layer.label ? layer.label : layer.name) + ' ' + subGroup + (group.searchOnTitle ? ' ' + group.title : ''),
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
                                domConstruct.place('<img src="../images/extlink.gif" title="Layer Information" data-service_layer="' + checkboxId + '" /><div class="slider-container" data-service_layer="' + checkboxId + '"></div>', element, 'last');
                                if (subGroup) {
                                    domConstruct.place('<div class="subGroup">' + subGroup + '</div>', element, 'first');
                                }
                            });
                        }
                        checkScale();

                        treeItemCount++;
                        if (treeItemCount === app.myStore.data.length - 1 && firstCompLoad) {
                            if (app.url.match(/\?/))
                                setMap();
                            app.tree.collapseAll();
                            dojo.query('#tree').show();
                            firstCompLoad = false;

                            var fadeInLayerInfo = fx.fadeIn({node:'layerInfoModal'}),
                                fadeOutLayerInfo = fx.fadeOut({node:'layerInfoModal'});

                            var moveableLayerInfo =  new move.constrainedMoveable("layerInfoModal", {
                                within: true,
                                handle: query('#layerInfoModal .modal-header'),
                                constraints: function(){return app.constraintBox;},
                                onMoveStart: function(){setIndices(this)}
                            });

                            on(fadeOutLayerInfo, 'End', function(){
                                domStyle.set(dom.byId('layerInfoModal'),'display', 'none');
                            });

                            query('#layerInfoModal .modal-header button.close').on('click', function (e){
                                fadeOutLayerInfo.play();
                            });

                            on(query('#side-panel img[title="Layer Information"]'), 'click', function (e) {
                                dom.byId('loading').style.display = 'block';
                                if (!e.desc) {
                                    var serviceUrl = e.target.attributes['data-service_layer'].value;
                                    if (serviceUrl.match(/duplicate/))
                                        serviceUrl = serviceUrl.substr(0, serviceUrl.indexOf('duplicate'));
                                    dojoRequest(serviceUrl + '?f=json', {
                                        handleAs: "json",
                                        timeout: app.timeout,
                                        headers: {
                                            'X-Requested-With': null
                                        }
                                    }).then(
                                        function(result) {
                                            query('#layerInfoModal span').html(result.name);
                                            var contentHtml = '';
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
                                            query('#layer-info-content').html(contentHtml + '</p></div>');
                                        }, function(error) {
                                            console.log("Error: ", error.message);
                                    });
                                }
                                else {
                                    query('#layerInfoModal span').html(e.name);
                                    query('#layer-info-content').html(e.desc);
                                    dom.byId('loading').style.display = 'none';
                                }
                                if (domStyle.get('layerInfoModal', 'display') === 'none') {
                                    domStyle.set(dom.byId('layerInfoModal'),'display', 'block');
                                    fadeInLayerInfo.play();
                                }
                                setIndices('e', 'layerInfoModal');
                            });

                            //  set left padding
                            query('div[data-dojo-attach-point="rowNode"]').forEach(function (n) {
                                n.style.paddingLeft = (domStyle.get(n, 'padding-left') + 6) + 'px';
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
                        var row = dojo.query('input[name="' + checkboxId + '"]').parent().parent().parent()[0];
                        domConstruct.place('<div id="' + domAttr.get(row, 'id') + '-placeholder"></div>', row, 'after');
                        domConstruct.place(row, dom.byId('search-results-container'));
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

        function checkScale (level, minLevel) {
            var scale = app.currentMap.getScale();
            if (!level) {
                array.forEach(registry.toArray(), function (widget, i) {
                    if (widget.hasOwnProperty('item') && widget.item != null) {
                        if ((widget.item.hasOwnProperty('minScale') && widget.item.minScale !== null) || (widget.item.hasOwnProperty('maxScale') && widget.item.maxnScale != null)) {
                                var zoomIn = false;
                                if (widget.item.hasOwnProperty('minScale'))
                                    if (widget.item.minScale < scale)
                                        zoomIn = true;
                                var checkboxWidget = registry.byId(widget.item.id.substr(0, widget.item.id.indexOf('-')));
                                if ((widget.item.minScale && widget.item.minScale < scale) || (widget.item.maxScale && widget.item.maxScale > scale)) {
                                    if (!checkboxWidget.get('disabled')) {
                                        checkboxWidget.set('disabled', true);
                                        domConstruct.place('<span class="zoom-notice" id="' + widget.item.id + 'zoom">zoom ' + (widget.item.minScale < scale ? 'in' : 'out') + ' to view</span>', widget.domNode.childNodes[0]);
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
            dojoRequest('http://50.19.218.171/arcgis1/rest/services/ClipZip/GPServer/Extract%20Data%20TaskKML/submitJob?Raster%5FFormat=File%20Geodatabase%20%2D%20GDB%20%2D%20%2Egdb&Area%5Fof%5FInterest=%7B%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%2C%22features%22%3A%5B%7B%22geometry%22%3A%7B%22rings%22%3A%5B%5B%5B%2D8374903%2E335905621%2C4717593%2E676607473%5D%2C%5B%2D7176370%2E7323943805%2C4717593%2E676607473%5D%2C%5B%2D7176370%2E7323943805%2C5570019%2E416043529%5D%2C%5B%2D8374903%2E335905621%2C5570019%2E416043529%5D%2C%5B%2D8374903%2E335905621%2C4717593%2E676607473%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D%7D%5D%7D&Layers%5Fto%5FClip=%5B%22' + layerName + '%22%5D&env%3AoutSR=102100&env%3AprocessSR=102100&f=json&Feature%5FFormat=File%20Geodatabase%20%2D%20GDB%20%2D%20%2Egdb&Spatial%5FReference=WGS%201984?f=json', {
                handleAs: "json",
                timeout: app.timeout,
                headers: {
                    'X-Requested-With': null
                }
            }).then(
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
                dojoRequest('http://50.19.218.171/arcgis1/rest/services/ClipZip/GPServer/Extract%20Data%20TaskKML/jobs/' + jobId + '?_ts=' + Date.now() + '&f=json').then(
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
                                    dojoRequest(dynamicLayer.URL + 'layers?f=json', {
                                        handleAs: "json",
                                        timeout: app.timeout,
                                        headers: {
                                            'X-Requested-With': null
                                        }
                                    }).then(
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
                                                loadMainTheme(app.themeIndex);
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
                    loadMainTheme(app.themeIndex);
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
                        dojoRequest(serviceURL + 'layers?f=json', {
                            handleAs: "json",
                            timeout: app.timeout,
                            headers: {
                                'X-Requested-With': null
                            }
                        }).then(
                            function(data) {
                                app.mapserverResponse++;
                                array.forEach(data.layers, function (layerObj, i) {
                                    array.forEach(group.layers, function (layer, j) {
                                        if (layer.serviceURL === serviceURL && layer.name === layerObj.name.trim() && (layer.parent === undefined || layer.parent === layerObj.parentLayer.name))
                                        {
                                            layer.id            = layerObj.id,
                                            layer.description   = layerObj.description,
                                            layer.minScale      = layerObj.minScale,
                                            layer.maxScale      = layerObj.maxScale;
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
                                                console.log('****** layer error ******');
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
                            }, function(error, io) {
                                var url = error.response.url.substr(0, error.response.url.indexOf('layers'));
                                console.log('****** mapserver timout ****** \n' + error.response.url);
                                app.mapserverResponse++;

                                configOptions.comp_viewer.groups.forEach(function (g) {
                                    g.serviceURLs.forEach(function (serviceUrl) {
                                        if (serviceUrl === url) {
                                            var validLayers = [];
                                            g.layers.forEach(function (groupLayer) {
                                                if (groupLayer.serviceURL !== url)
                                                    validLayers.push(groupLayer)
                                                else
                                                    app.layersUnloaded--;
                                            });
                                            g.layers = validLayers;
                                            console.log('MODIFIED: ' + g.title);
                                        }
                                    });
                                });

                                // if (app.mapservers === app.mapserverResponse) {
                                //     createMap();
                                // }
                                if (app.layersLoaded === app.layersUnloaded) {
                                                createMap();
                                            }
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
                        var layer = new ArcGISTiledMapServiceLayer(service, {id : layerId, opacity : 0.8});
                    else {
                        var layer = new ArcGISDynamicMapServiceLayer(service, {id : layerId, opacity : 0.8});
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
                    value               : 8,
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

            app.dynamicLegends = 0;

            configOptions.themes[app.themeIndex].maps.forEach(function (subtheme) {
                app.dynamicLegends += subtheme.layers.dynamicLayers.length;
            });

            if (domStyle.get(app.sidePanel, 'display') === 'block') {
                app.observer.observe(dom.byId('legendWrapper'), {
                    attributes: true,
                    subtree: true
                });

                domStyle.set(app.sidePanel, 'display', 'none');
                if (domStyle.get(dom.byId('legendModal-dv'), 'display')  === 'block') {
                    domStyle.set(dom.byId('legendModal-dv'), 'display', 'none');
                    on.emit(dom.byId('show-hide-legend-btn'), 'click', {bubbles: true, cancelable: true});
                }
                if (domStyle.get(dom.byId('layerInfoModal'), 'display')  === 'block') {
                    domStyle.set(dom.byId('layerInfoModal'), 'display', 'none');
                }
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

                // if (app.screenWidth < 1024)
                //     domClass.remove("legendButton", "active");
                // else
                query('#legendModal').style({
                    'display'   : 'block',
                    'top'       : '100px',
                    'left'      : '65px'
                });

                if (app.firstLV_load) {
                    var moveableLegend =  new move.constrainedMoveable("legendModal", {
                        within: true,
                        handle: query('#legendModal .modal-header'),
                        constraints: function(){return app.constraintBox;}
                    });

                    var moveableAbout =  new move.constrainedMoveable("aboutModal", {
                        within: true,
                        handle: query('#aboutModal .modal-header'),
                        constraints: function(){return app.constraintBox;}
                    });

                    query('#legendModal .modal-header button.close').on('click', function (e){
                        domAttr.set(dom.byId('legend-tab'), 'src', 'img/side-buttons/legend-tab-out-off.png');
                        fadeOutLegend.play();
                    });

                    query('#aboutModal .modal-header button.close').on('click', function (e){
                        domAttr.set(dom.byId('about-tab'), 'src', 'img/side-buttons/about-tab-out-off.png');
                        fadeOutAbout.play();
                    });

                    query('#legendModal, #aboutModal').modal({show : false});

                    var fadeInLegend = fx.fadeIn({node:'legendModal'}),
                        fadeOutLegend = fx.fadeOut({node:'legendModal'}),
                        fadeInAbout = fx.fadeIn({node:'aboutModal'}),
                        fadeOutAbout = fx.fadeOut({node:'aboutModal'});


                    on(fadeOutLegend, 'End', function(){
                        query('#legendModal').style('display', 'none');
                    });

                    on(fadeInLegend, 'End', function(){
                        query('#legendModal').style('display', 'block');
                    });

                    on(fadeOutAbout, 'End', function(){
                        query('#aboutModal').style('display', 'none');
                    });

                    on(fadeInAbout, 'End', function(){
                        query('#aboutModal').style('display', 'block');
                    });

                    query('#legend-tab').on('click', function (e){
                        if (query('#legendModal').style('display') == 'none') {
                            domAttr.set(dom.byId('legend-tab'), 'src', 'img/side-buttons/legend-tab-out-on.png');
                            query('#legendModal').style('display', 'block');
                            setIndices('e', 'legendModal');
                            fadeInLegend.play();
                        }
                        else {
                            domAttr.set(dom.byId('legend-tab'), 'src', 'img/side-buttons/legend-tab-out-off.png');
                            fadeOutLegend.play();
                        }
                    });

                    query('#about-tab').on('click', function (e){
                        if (query('#aboutModal').style('display') == 'none') {
                            domAttr.set(dom.byId('about-tab'), 'src', 'img/side-buttons/about-tab-out-on.png');
                            query('#aboutModal').style('display', 'block');
                            setIndices('e', 'aboutModal');
                            fadeInAbout.play();
                        }
                        else {
                            domAttr.set(dom.byId('about-tab'), 'src', 'img/side-buttons/about-tab-out-off.png');
                            fadeOutAbout.play();
                        }
                    });

                    app.firstLV_load = false;
                }

                updateAboutText(0);
            }

            app.subthemeIndex = themeIndex;
            app.maps = [];

            createSubThemeButtons();

            array.forEach(configOptions.themes[app.themeIndex].maps, function(map, mapIndex){
                // place map div in map-pane
                domConstruct.place('<div id="map' + mapIndex + '" class="map-pane main lite-viewer' + ((mapIndex == 0) ? ' active"' : '"') + '></div>', 'map-container');
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

                var dynamicLayers = [];

                if (map.layers.hasOwnProperty("dynamicLayers")) {
                    array.forEach(map.layers.dynamicLayers, function (dynamicLayer, i) {
                        visibleLayers = [];
                        var dl = new ArcGISDynamicMapServiceLayer(dynamicLayer.URL, {id : dynamicLayer.name});
                        mapDeferred.layer = dl;
                        array.forEach(dynamicLayer.layers, function (layer, layerIndex) {
                            if (layer.hasOwnProperty("checked")) {
                                if (layerIndex === 0)
                                     dojo.place("<div id='radioWrapper'></div>", "legendWrapper");
                                radio = new dijit.form.RadioButton({
                                    id          : 'radio_' + layer.ID,
                                    label       : layer.name,
                                    value       : layer.ID,
                                    name        : 'radio-buttons',
                                    checked     : layer.checked,
                                    onClick     : function(e) {radioClick(this.value);
                                                  }
                                }, dojo.create('input', null, dojo.byId('radioWrapper')));
                                dojo.create('label', { 'for' : 'radio_' + layer.ID , innerHTML : layer.name, 'class' : 'radio-buttons' }, dojo.byId('radioWrapper'));
                                if (layer.checked) {
                                    visibleLayers.push(layer.ID);
                                    app.radioSelection = layer.ID;
                                }
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
                        layerInfo.push({layer : dl});
                        dynamicLayers.push(dl);
                        // map.flexLink = 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;admin=9999;hapc=9999;efh=9999;ngdc=9999;ocean=9999';
                        // array.forEach(visibleLayers, function (layerID) {
                        //     map.flexLink += (',' + layerID);
                        // });
                        // map.flexLink += ';HereIsMyMap#';
                        // if (mapIndex === 0)
                            // query('#flex-link')[0].href = map.flexLink;
                    });
                    mapDeferred.addLayers(dynamicLayers);
                }

                mapDeferred.on('layers-add-result', function (e) {
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
                                checkScale(e.level, minLevel);
                                app.currentMap.legend.refresh();
                                updateLegend();
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
                    if (mapDeferred.loaded && mapDeferred === app.currentMap) {
                        if (app.setMap) {
                            on.emit(dom.byId('subThemeButton' + app.shareObj.subthemeIndex), 'click', {bubbles: true, cancelable: true});
                            if (app.shareObj.basemap === 'satellite')
                                on.emit(dom.byId('dijit_MenuItem_1'), 'click', {bubbles: true, cancelable: true});
                            else if (app.shareObj.basemap === 'chart')
                                on.emit(dom.byId('dijit_MenuItem_2'), 'click', {bubbles: true, cancelable: true});
                            app.currentMap.centerAndZoom(app.shareObj.point, app.shareObj.zoom);
                            if (app.shareObj.hasOwnProperty('radioSelection'))
                                on.emit(dom.byId('radio_' + app.shareObj.radioSelection), 'click', {bubbles: true, cancelable: true});
                            app.setMap = false;
                        }
                        share();
                        query('#loading').style("display", "none");
                    }
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
                    if (mapDeferred === app.currentMap) {
                        query('#scale')[0].innerHTML = "Scale 1:" + mapDeferred.__LOD.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                });
            });
            
            app.headerOffset = query('.navbar-fixed-top').style('height')[0];

            app.oldZoomLevel = app.currentMap.getLevel();

            var menuWidth = configOptions.themes[app.themeIndex].maps[app.subthemeIndex].menuWidth;
            query('#legendModal').style('width', menuWidth + 'px');
            //query('#legend-lv').style('width', (menuWidth + 2) + 'px');
            dom.byId('flex-link').href = configOptions.themes[app.themeIndex].maps[app.subthemeIndex].flexLink;
            dom.byId('theme-title').innerHTML = configOptions.themes[app.themeIndex].title;
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
            if (configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction)
                checkScale(app.currentMap.getLevel(), configOptions.themes[app.themeIndex].maps[app.subthemeIndex].scaleRestriction.minLevel)

            if (configOptions.themes[app.themeIndex].maps[mapIndex].flexLink)
                query('#flex-link')[0].href = configOptions.themes[app.themeIndex].maps[mapIndex].flexLink;

            query('#legendAbout p').text(configOptions.themes[app.themeIndex].title + ': ' + configOptions.themes[app.themeIndex].maps[mapIndex].title);
            share();
            domStyle.set(dom.byId('layerInfoModal'),'display', 'none');
            domStyle.set(dom.byId('aboutModal'),'display', 'none');
            updateLegend();
        }

        updateAboutText = function (subthemeIndex)
        {
            query('#overview p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.overview;
            query('#data-considerations p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.dataConsiderations;
            query('#status p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].about.status +
                "<br><br>For information about how these data and maps are being developed with stakeholder input and used to support regional ocean planning, please visit the <a href='http://neoceanplanning.org/projects/maritime-commerce/' target='_blank'>maritime commerce</a> page on the Northeast Regional Planning Body's website.";
            dom.byId('sub-theme-title').innerHTML = configOptions.themes[app.themeIndex].maps[subthemeIndex].title;
        }

        createLegend = function (layerInfos, i)
        {
            if (configOptions.themes[app.themeIndex].maps[i].scaleRestriction){
                var noticeHTML = "<div class='" + configOptions.themes[app.themeIndex].maps[i].group + (i === 0 ? ' active' : '') +
                " notice'>Zoom in to view '" + configOptions.themes[app.themeIndex].maps[i].scaleRestriction.text + "'</div>";
                domConstruct.place(noticeHTML, dom.byId('title-header'), 'after');
            }
            var legendContentDiv = query('#legendWrapper')[0];
            var legendDivHTML = '<div id="legendDiv' + i + '" class="legendDiv' + (i == 0 ? ' active"' : '"') + '></div>';
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
                            var td = query('#legend-lv .legendDiv .esriLegendService div table.esriLegendLayerLabel tr td:contains("' + layer.name + '")')
                            if (td.text() == layer.name)td.html('<a href="" data-name="' + layer.name + '" data-description="<p>' + layer.description +  '<br><br><a href=\'' + layer.metadata + '\' target=\'_blank\' style=\'text-decoration:underline;color:#063;\'>Metadata</a></p>" title="Layer Information">' + layer.name + '</a>');
                        });
                    });
            });
            on(query('.legendDiv a'), 'click', function (e) {
                e.preventDefault();
                on.emit(query('#side-panel img[title="Layer Information"]')[0], 'click', {
                    bubbles     : true,
                    cancelable  : true,
                    name        : e.currentTarget.attributes['data-name'].value,
                    desc        : e.currentTarget.attributes['data-description'].value
                });
            });
            if (dom.byId('legendWrapper').scrollHeight >= 443) {
                dom.byId('legendWrapper').style.borderTop = '1px solid #ccc';
            }
            else
                dom.byId('legendWrapper').style.borderTop = 'none';

            if (app.themeIndex === 0 && app.subthemeIndex === 0) {
                domConstruct.place('legendDiv0_oceanUses_19', 'legendDiv0_oceanUses_28', 'after');
            }
        }

        radioClick = function (id)
        {
            app.currentMap.layer.setVisibleLayers([id]);
            app.radioSelection = id;
            app.currentMap.legend.refresh();
            updateLegend();
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
            app.searchResults = true;
            app.treeHeight += app.searchContainerHeight;
            resizeSidePanel();
            dojo.byId('layer-select').value = '';
        }

        setMap = function () {
            app.setMap = true;
            var shareString = decodeURI(app.url.substr(app.url.indexOf('?') + 1));
            app.shareObj = JSON.parse(shareString);

            if (!app.shareObj.hasOwnProperty('themeIndex')) {
                if (app.shareObj.basemap === 'satellite')
                    on.emit(dom.byId('dijit_MenuItem_1'), 'click', {bubbles: true, cancelable: true});
                else if (app.shareObj.basemap === 'chart')
                    on.emit(dom.byId('dijit_MenuItem_2'), 'click', {bubbles: true, cancelable: true});

                app.currentMap.centerAndZoom(app.shareObj.point, app.shareObj.zoom);

                if (app.shareObj.layerIds.length > 0) {
                    app.shareObj.layerIds.forEach(function (layerId) {
                        registry.toArray().forEach(function (widget, i) {
                            if (widget.type === 'checkbox')
                                if (widget.id === layerId)
                                    widget.set('checked', true);
                        });
                    });
                }
            }
            else {
                on.emit(query('p[data-theme-id="' + app.shareObj.themeIndex + '"')[0], 'click', {bubbles: true, cancelable: true});
            }
        }

        getActiveLayerIds = function () {
            var layerIds = [];
            app.currentMap.layerIds.forEach(function (layerId) {
                if (app.currentMap._layers[layerId].url !== 'http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer' &&
                    app.currentMap._layers[layerId].url !== 'http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer' &&
                    app.currentMap._layers[layerId].url !== 'http://seamlessrnc.nauticalcharts.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer' &&
                    app.currentMap._layers[layerId].url !== 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')
                    layerIds.push(layerId);
            });
            return layerIds;
        }

        setIndices = function (e, modalId) {
            var id = '';
            if (modalId)
                id = modalId;
            else
                id = e.currentTarget.parentElement.parentElement.id;
            var zIndices = [];
            query('.moveable').forEach(function (n) {
                if (domAttr.get(n, 'id') !== id && domStyle.get(n, 'display') === 'block')
                    zIndices.push(domStyle.get(n, 'z-index'));
            });
            domStyle.set(dom.byId(id), 'z-index', Math.max.apply(null, zIndices) + 1);
        }

        themeClick = function(thisNode) {
            var themeIndex = parseInt(thisNode.attributes["data-theme-id"].value, 10);
                if (themeIndex !== 10 && !domClass.contains(thisNode, 'active-theme')) { // 10 is data viewer
                    if (themeIndex === 0) { // 0 is maritime commerce
                        app.themeIndex = themeIndex;
                        query('#mapList .active-theme').forEach(function (n) {
                            domClass.remove(n, 'active-theme');
                        });
                        query('#mapList p[data-theme-id="' + app.themeIndex + '"]').forEach( function(n) {
                            domClass.add(n, 'active-theme');
                        });
                        dom.byId('watermark').style.left = '9px';
                        app.lv = true;
                        getLayerIds(app.lv);
                    }
                }
                else if (themeIndex === 10) {
                    query('#mapList .active-theme').forEach(function (n) {
                            domClass.remove(n, 'active-theme');
                        });
                    query('#mapList p[data-theme-id="10"]').forEach( function(n) {
                        domClass.add(n, 'active-theme');
                    });
                    app.sidePanel.style.display = 'block';
                    dom.byId('watermark').style.left = '315px';
                    query('.legendDiv').forEach(domConstruct.destroy);
                    query('.lite-viewer.map').forEach(domConstruct.destroy);
                    query('#legend-lv .notice').forEach(domConstruct.destroy);
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
                    if (domStyle.get(query('#aboutModal')[0], 'display') === 'block') {
                        domStyle.set(query('#aboutModal')[0], 'display', 'none');
                        domAttr.set(dom.byId('legend-tab'), 'src', 'img/side-buttons/legend-tab-out-off.png');
                    }
                    domStyle.set(dom.byId('side-tabs'), 'display', 'none');
                    domStyle.set(dom.byId('layerInfoModal'),'display', 'none');
                    domClass.add(dom.byId('data-viewer'), 'active');
                    app.currentMap = app.dataViewer;
                    app.lv = false;
                    resizeMap();
                }
        }

        return {
            init: init
        }
    }
);