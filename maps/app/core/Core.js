var app = {};
define([
    'esri/map',
    'esri/request',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/FeatureLayer',
    'esri/InfoTemplate',
    'esri/dijit/Scalebar',
    'esri/dijit/Legend',
    'esri/geometry/Point',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTemplate',
    'esri/tasks/LegendLayer',
    'esri/tasks/PrintTask',
    //'esri/layers/osm', 
    'dojo/query',
    'dojo/on',
    'dojo/dom-construct',
    'dojo/dnd/move',
    'dojo/dom-class',
    'dojo/request/notify',
    'dijit/focus',
    'dojo/fx',
    'dojo/_base/fx',
    'dojo/_base/array',
    'dojo/behavior',
    'bootstrap/Dropdown',
    'bootstrap/Collapse',
    'bootstrap/Button',
    'bootstrap/Modal',
    'bootstrap/Tooltip',
    'bootstrap/Carousel',
    'bootstrap/Tab',
    'dojo/domReady!'
    ], 
    function(
        Map,
        EsriRequest,
        ArcGISDynamicMapServiceLayer,
        ArcGISImageServiceLayer,
        FeatureLayer,
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
        focusUtil,
        coreFx,
        fx,
        array,
        behavior
        ) 
    {
        var asa, chart, legend, geodata, biology, osmLayer, watersgeo, physOcean, oceanUses,
            layer0, layer1, layer2, 
            aquaculture, screenWidth, screenHeight, headerOffset, selectedBasemap, firstLoad = true,
            aboutLayerOpen = false, watershed, scalebar, subThemeName, mapName, mobile = false,
            aquacultureUrl = 'http://50.19.218.171/arcgis1/rest/services/LiteViewers/Aquaculture/MapServer/',
            ngdcUrl = 'http://maps.ngdc.noaa.gov/arcgis/rest/services/web_mercator/dem_hillshades_mosaic/MapServer/',
            watersgeoUrl = 'http://watersgeo.epa.gov/arcgis/rest/services/OWRAD/ALL_OWRAD_NAD83/MapServer/',
            geodataUrl = 'http://geodata.epa.gov/arcgis/rest/services/OEI/FRS_INTERESTS/MapServer/',
            asaUrl = 'http://gis.asascience.com/ArcGIS/rest/services/RegionalPortal/WaterQuality/MapServer/',
            asaFifty = 'http://50.19.218.171/arcgis1/rest/services/',
            watershedUrl = 'http://watersgeo.epa.gov/ArcGIS/rest/services/OW/WBD_WMERC/MapServer/',
            biologyUrl = asaFifty + 'Biology/MapServer/', oceanUsesUrl = asaFifty + 'OceanUses/MapServer/',
            physOceanUrl = asaFifty + 'PhysicalOceanography/MapServer/', radioSelection = 0, radioSelection1 = 0,
            radioSelection2 = 0, radioSelection3 = 0, radioSelection4 = 0, sliderValue = 0, cm = 0,
            metaUrl = 'http://www.northeastoceandata.org/files/metadata/', featureLayers = [],
            layers = [], mapUrl = window.location.href, energy = 'energy', fishing = 'commercial-fishing',
            recreation = 'recreation', shellfish = 'fish-and-shellfish', mammals = 'marine-life-mammals',
            wq = 'water-quality', aqua = 'aquaculture';

        isMobile();

        function init()
        {
            app.maps = [];
            app.themeIndex = 0;

            // create buttons for each theme
            array.forEach(configOptions.themes, function (theme, themeIndex){
                domConstruct.place('<li><a id="dropdownTheme' + themeIndex + ' href="#">' + theme.title.toUpperCase() + '</a></li>', 'themeDropdown');
                domConstruct.place('<button id="theme' + themeIndex + ' type="button" class="btn btn-default no-bottom-border-radius' + (themeIndex === 0 ? ' active"' : (themeIndex === (configOptions.themes.length - 1) ? ' no-bottom-right-border-radius"' : '"')) + ' data-toggle="button">' + theme.title.toUpperCase() + '</button>', 'themeButtonGroup');
                domConstruct.place('<div class="item' + (themeIndex === 0 ? ' active"' : '"') + '><button class="btn btn-default no-bottom-border-radius' + (themeIndex === 0 ? ' active"' : '"') + ' type="button" id="carouselButton' + themeIndex + '" data-toggle="button">' + theme.title.toUpperCase() + '</button></div>', 'mapCarouselInner');
            });

            resizeMap();

            if (mapUrl.match(/yellahoose/i))
                energy = '1120', fishing = '1779', recreation = '1650', shellfish = '1652',
                mammals = '1380', wq = '2139', aqua = '1122';

            esri.config.defaults.io.proxyUrl = "http://services.asascience.com/Proxy/esriproxy/proxy.ashx";

            app.currentMap = null;

            createMap();

            app.currentMapIndex = 0;

            behavior.add({
                '.esriLegendService' : {
                    found: function(){updateLegend();}
                }
            });

            var notifyCount = 0;

            notify('done',function(responseOrError){
                if (responseOrError.hasOwnProperty('url'))
                    if (responseOrError.url.match(/legend/i))
                    {
                        notifyCount++;
                        if (notifyCount === configOptions.themes[app.themeIndex].maps.length)
                            behavior.apply();
                    }
            });
        }

        function resizeMap()
        {
            screenHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            screenWidth = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
            headerOffset = query('.navbar').style('height')[0];
            query('#map-pane').style({
                'height'        : (screenHeight - headerOffset) + 'px',
                'marginTop'    : screenWidth < 980 ? '0' : headerOffset + 'px'
            });
            query('.map').style({
               'height'        : (screenHeight - headerOffset) + 'px'
            });
        }

        window.onresize = function(event) {
            resizeMap();
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
            
            template.layoutOptions.titleText = configOptions.themes[app.themeIndex].title + ' | ' + configOptions.themes[app.themeIndex].maps[app.currentMapIndex].title;
            template.layoutOptions.authorText = 'Northeast Ocean Data Portal';
            template.layoutOptions.legendLayers = legendLayers;

            params.template = template;
            params.map = app.currentMap;

            var printTask = new PrintTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task", params);

            printTask.execute(params, function printTaskCallback(result) {
                window.open(result.url);
                query('#printButton').button('reset');
                //query('#loading').style('display', 'none');
            });
        }

        function createBasemapGallery()
        {    
            var basemaps = new Array('oceans', 'satellite', 'chart');
            var i = 0;
            for (i; i < 3; i++) {        
                domConstruct.place("<li data-name='" + basemaps[i] + "'><a href='#'><img src='img/" + basemaps[i] + ".png' />&nbsp;&nbsp;&nbsp;" + basemaps[i] + "</a></li>", "basemapDropdownList");
            };
            
            on(query('#basemapDropdownList.dropdown-menu li'), 'click', function(e){
                switch (e.currentTarget.attributes[0].value){
                    case 'oceans':
                        array.forEach(app.maps, function(map){
                            map.setBasemap('oceans');
                        });
                        chart.hide();
                        break;
                    case 'satellite':
                        array.forEach(app.maps, function(map){
                            map.setBasemap('satellite');
                        });
                        chart.hide();
                        break;
                    case 'chart':
                        chart.show();
                        var basemapLayerID;
                        array.forEach(app.maps, function(map){
                            basemapLayerID = map.basemapLayerIds[0];
                            for (var prop in map._layers)
                                if (prop == basemapLayerID)
                                    map._layers[prop].hide();
                                        map._basemap = 'chart';
                        });
                        break;
                }
            });

            var locations = new Array('Northeast', 'Cape Cod', 'Gulf of Maine', 'Long Island Sound');

            for (i = 0; i < locations.length; i++){
                domConstruct.place("<li data-name='" + locations[i] + "'><a href='#'>" + locations[i] + "</a></li>", "zoomToDropdownList");
            }
            on(query('#zoomToDropdownList.dropdown-menu li a'), 'click', function(e){
                switch (e.currentTarget.innerHTML){
                    case 'Northeast':
                        array.forEach(app.maps, function(map){
                            map.centerAndZoom(new Point(-70.5, 42), 7);
                        });
                        break;
                    case 'Cape Cod':
                        array.forEach(app.maps, function(map){
                            map.centerAndZoom(new Point(-70.261903, 41.797936), 10);
                        });
                        break;
                    case 'Gulf of Maine':
                        array.forEach(app.maps, function(map){
                            map.centerAndZoom(new Point(-68.901615, 42.851806), 8);
                        });
                        break;
                    case 'Long Island Sound':
                        array.forEach(app.maps, function(map){
                            map.centerAndZoom(new Point(-72.824464, 41.111434), 10);
                        });
                        break;
                }
            });
        }

        function share()
        {
            var longUrl = '';
            var point = new esri.geometry.Point(app.map.extent.getCenter());
            var baseUrl = mapUrl;
            if (baseUrl.indexOf("#") > 0)
                baseUrl = baseUrl.substring(0, mapUrl.indexOf('#'));
            if (baseUrl.indexOf("&z=") > 0)
                baseUrl = baseUrl.substring(0, mapUrl.indexOf('z') - 1);
            
            var wlf = window.location.href; 
            var pil = '#?page_id='; 
            if (wlf.search("maps/maritime-commerce") != -1) pil += "1118"; 
            else if (wlf.search("maps/energy") != -1) pil += "1120"; 
            else if (wlf.search("maps/recreation") != -1) pil += "1650"; 
            else if (wlf.search("maps/commercial-fishing") != -1) pil += "1779"; 
            else if (wlf.search("maps/aquaculture") != -1) pil += "1122"; 
            else if (wlf.search("maps/fish-and-shellfish") != -1) pil += "1652"; 
            else if (wlf.search("maps/marine-life-mammals") != -1) pil += "1380"; 
            else if (wlf.search("maps/other-marine-life") != -1) pil += "1654"; 
            
            longUrl += baseUrl.replace('#', '') + pil +'&z=' + app.map.getZoom() + '&b=' + app.map._basemap + '&m=' + cm + '&r=' + radioSelection + '&x=' + point.x + '&y=' + point.y;

            if (mapUrl.indexOf(energy) > 0)
                longUrl += '&sl=' + sliderValue;
            // $j.ajax({
            //     type: 'GET',
            //     url: 'http://api.bit.ly/v3/shorten',
            //     dataType: "jsonp",
            //     data: {
            //         login: 'ssontag',
            //         apiKey: 'R_3802a64a9ae967439f44d5aebe7eabb8',
            //         format: 'json',
            //         longUrl: longUrl
            //     },
            //     success: function(data){
            //         $j('div#share-me').text(data.data.url);
            //         $j('div#share-dialog p#url').html('<a href="' + data.data.url + '" target="_blank">' + data.data.url + '</a>');
            //     }
                
            // });
        }

        function createMap()
        {
            domConstruct.place("<img src='img/loading.gif' id='loading' />"
            + "<div id='watermark'>Northeast Ocean Data</div>"
            + "<span id='scale'></span>"
            + "<div id='mapControls' class='btn-group'><div class='btn-group' id='zoomToDropdownDiv'><button class='btn btn-default dropdown-toggle dropdown no-top-left-border-radius no-top-right-border-radius no-bottom-right-border-radius' id='zoomToDropdown' href='#' data-toggle='dropdown'>"
            + "Zoom to<span class='caret'></span></button>"
            + "<ul class='dropdown-menu' id='zoomToDropdownList'></ul></div>"
            + "<div class='btn-group' id='basemapDropdownDiv'><button class='btn btn-default dropdown-toggle dropdown no-border-radius' id='basemapDropdown' href='#' data-toggle='dropdown'>"
            + "Basemaps<span class='caret'></span></button>"
            + "<ul class='dropdown-menu' id='basemapDropdownList'></ul></div>"
            + "<button class='btn btn-default ' id='shareButton'>Share</button>"
            + "<button class='btn btn-default no-top-right-border-radius' data-loading-text='Loading' id='printButton'>Print</button></div></div>"
            + "<div id='side-buttons'>"
            + "<button href='#legendModal' type='button' id='legendButton' class='btn btn-default active no-bottom-border-radius'>Legend / About</button>"
            + "<button type='button' id='feedbackButton' class='btn btn-default no-bottom-border-radius'>Feedback</button></div>" +
            "<div id='legendModal' class='modal' role='dialog' data-backdrop='false'>" +
                "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'><span class='icon-remove'></span></button>" +
                    "<ul id='tabs' class='nav nav-tabs'>" +
                        "<li class='active'><a href='#legend' data-toggle='tab'>Legend</a></li>" +
                        "<li><a href='#about' data-toggle='tab'>About</a></li>" +
                    "</ul>" +
                    "<!--<h5>Legend</h5><div class='alert alert-info'>Zoom-in to view hidden layer(s).</div>-->" +
                "</div>" +
                "<div class='tab-content'>" +
                    "<div id='legend' class='tab-pane fade active in'>" +
                        "<div class='modal-body' id='legendWrapper'></div>" +
                        "<div class='modal-footer'><a id='flex-link' href='#'>View this data with other layers</a></div>" +
                    "</div>" +
                    "<div id='about' class='modal-body tab-pane fade'>" +
                        "<strong>Overview</strong><div id='overview'><p>blah</p></div>" +
                        "<strong>Data Considerations</strong><div id='data-considerations'><p>blah</p></div>" +
                        "<strong>Status</strong><div id='status'><p>blah</p></div>" +
                    "</div>" +
                "</div>" +
            "</div>", "map-pane");
            
            
            chart = new ArcGISImageServiceLayer('http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');

            array.forEach(configOptions.themes[app.themeIndex].maps, function(map, mapIndex){
                // place map div in map-pane
                domConstruct.place('<div id="map' + mapIndex + '" class="map' + ((mapIndex == 0) ? ' active' : '') + '" style="height: ' + (screenHeight - headerOffset) + 'px;"></div>', 'map-pane');
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

                if (map.layers.hasOwnProperty("dynamicLayers"))
                    array.forEach(map.layers.dynamicLayers, function (dynamicLayer, i) {
                        var dl = new ArcGISDynamicMapServiceLayer(dynamicLayer.URL);
                        mapDeferred.addLayers([dl]);
                        mapDeferred.layer = dl;
                        array.forEach(dynamicLayer.layers, function (layer, layerIndex) {
                            /* get layer descriptions
                            ========================== */
                            var getlayerInfo = EsriRequest({
                                url: dynamicLayer.URL + layer.ID,
                                content: {
                                    f: "json",
                                    returnGeometry: false
                                },
                                handleAs: "json",
                                callbackParamName: "callback"
                            });

                            getlayerInfo.then(
                                function(data) {
                                    layer['description'] = data.description;
                                }, function(error) {
                                    console.log("Error: ", error.message);
                            });

                            if (layer.hasOwnProperty("checked")) {
                                if (layerIndex === 0)
                                     dojo.place("<div id='radioWrapper' class='btn-group-vertical' " +
                                        "data-toggle='buttons-radio'></div>", "legendWrapper");
                                dojo.place("<button data-id='" + layer.ID + "' class='btn btn-default" +
                                (layer.checked ? " active" : " ") + "'>" + layer.name + "</button>", "radioWrapper");
                                if (layer.checked)
                                    visibleLayers.push(layer.ID)
                            }
                            else
                                visibleLayers.push(layer.ID);
                            if (layer.hasOwnProperty("outField"))
                            {
                                var fl = new FeatureLayer(dynamicLayer.URL + layer.ID, {
                                    infoTemplate : new InfoTemplate('', '${' + layer.outField + '}'),
                                    outFields: [layer.outField],
                                    opacity: 0.0,
                                    mode: FeatureLayer.MODE_SNAPSHOT,
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
                    });

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
                        updateNotice();
                        if (app.currentMapIndex === 0){
                            if (e.level >= 12 && app.oldZoomLevel < 12) {
                                app.currentMap.legend.refresh();
                                behavior.apply();
                            }
                            else if (e.level < 12 && app.oldZoomLevel >= 12) {
                                app.currentMap.legend.refresh();
                                behavior.apply();
                            }
                        }
                        else if (app.currentMapIndex === 1) {
                            if (e.level >= 10 && app.oldZoomLevel < 10) {
                                app.currentMap.legend.refresh();
                                behavior.apply();
                            }
                            else if (e.level < 10 && app.oldZoomLevel >= 10) {
                                app.currentMap.legend.refresh();
                                behavior.apply();
                            }
                        }
                        if (e.level == 14) {
                             var point = new esri.geometry.Point(app.currentMap.getCenter());
                             if (point.x > -7754990.997596861) {
                                 if (osmLayer == null) {
                                     osmLayer = new esri.layers.OpenStreetMapLayer();
                                     app.currentMap.addLayer(osmLayer, 1);
                                 }
                                 else
                                     osmLayer.show();
                             }
                                else
                                    if (osmLayer != null)
                                     osmLayer.hide();
                            }
                        else if (osmLayer != null)
                            osmLayer.hide();
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

                mapDeferred.addLayer(chart, 1);

                var scalebar = new Scalebar({
                    map         : mapDeferred,
                    attachTo    : 'bottom-right'
                });

                mapDeferred.on('load', function(){
                    if (mapDeferred === app.currentMap)
                    {
                        query('#scale')[0].innerHTML = "Scale 1:" + mapDeferred.__LOD.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                });
            });

            // app.map.on('extent-change', function(e){
            //     query('#scale')[0].innerHTML = "Scale 1:" + e.lod.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            // });

            // app.map.on('pan-end', function(){
            //  if (app.map.getLevel() == 14) {
            //      var point = new esri.geometry.Point(app.map.extent.getCenter());
            //      if (point.x > -7754990.997596861) {
            //          if (osmLayer == null) {
            //              osmLayer = new esri.layers.OpenStreetMapLayer();
            //              app.map.addLayer(osmLayer, 1);
            //          }
            //          else
            //              osmLayer.show();
            //      }
            //      else
            //          osmLayer.hide();
            //  }
            //  else if (osmLayer != null)
            //      osmLayer.hide();
            // });

            // app.map.on('load', function () {
            //     chart = new ArcGISImageServiceLayer('http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');
            //     app.map.addLayer(chart, 1);
            //     chart.hide();
            //     createBasemapGallery();
            //     var href = mapUrl;
            //     // if (href.indexOf("&z") > 0) {
            //     //     var hrefArray = href.substring(href.indexOf("z")).split('&');
            //     //     var bmap = hrefArray[1].substring(hrefArray[1].indexOf("=") + 1);
            //     //     if (bmap == "chart") {
            //     //         chart.show();
            //     //         var basemapLayerID = map.basemapLayerIds[0];
            //     //         for (var prop in map._layers)
            //     //             if (prop == basemapLayerID)
            //     //                 map._layers[prop].hide();
            //     //         map.setBasemap('chart');
            //     //     }
            //     //     else
            //     //         map.setBasemap(bmap);
            //     //     radioSelection = parseInt(hrefArray[3].substring(hrefArray[3].indexOf("=") + 1));
            //     //     if ($j('#radio_' + radioSelection).length > 0)
            //     //         dijit.byId('radio_' + radioSelection).set('checked', true);
            //     //     var point = new esri.geometry.Point([hrefArray[4].substring(hrefArray[4].indexOf("=") + 1), hrefArray[5].substring(hrefArray[5].indexOf("=") + 1).replace('#', '')], map.spatialReference);
            //     //     map.centerAndZoom(new esri.geometry.Point(point.getLongitude(), point.getLatitude()), hrefArray[0].substring(hrefArray[0].indexOf("=") + 1));
            //     //     changeMap(parseInt(hrefArray[2].substring(hrefArray[2].indexOf("=") + 1), 10));
            //     //     if (window.location.href.indexOf(energy) > 0 )
            //     //         if (radioSelection == 3)
            //     //             dijit.byId("sliderWrapper2").set("value", parseFloat(hrefArray[6].substring(hrefArray[6].indexOf("=") + 1)));
            //     //         else
            //     //             dijit.byId("sliderWrapper1").set("value", parseFloat(hrefArray[6].substring(hrefArray[6].indexOf("=") + 1)));
            //     // }
            //     //neodShowHideBox('legend', 'whatever', true);
            //     //$j('img#legend-img').attr('src', 'images/legend-tab-out-on.png');
            //     //$j('.tab').show();
            //     firstLoad = false;
            //     // if (navigator.userAgent.match(/msie 7.0/i))
            //     //     if ($j('label').length > 0)
            //     //         $j.each(jQuery('label'), function (i, v) {
            //     //             $j(v).after('<div style="clear:both;"></div>');
            //     //         });
            //     //$j('#dropdownWrapper').show();
            //     //checkLegendHeight();
            //     //createLayerLinks();
            //     app.currentMapIndex = 0;
            //     app.map.oldZoomLevel = app.map.getLevel();
            //     if (mobile) {
            //         dojo.style(dojo.byId("mapDiv_zoom_slider"), "display", "none");
            //         dojo.style(dojo.byId("watermark"), "display", "none");
            //     }
            // });

            //cm = 0;
            

            chart.hide();

            createBasemapGallery();

            createSubThemeButtons();

            var constraintBox = {
                        l:  0,
                        t:  69,
                        w:  screenWidth,
                        h:  query('#map-pane').style('height')[0]
                    };

            var moveableLegend =  new move.constrainedMoveable("legendModal", {
                within: true,
                handle: query('#legendModal .modal-header'),
                constraints: function(){return constraintBox;}
            });

            query('#mapCarousel').carousel({interval: false});

            query('#mapCarousel button').on('click', function (e){
                domClass.remove(query('#mapCarousel button.btn.active')[0], 'active');
                domClass.add(query(e.target), 'active');
            });

            if (screenWidth < 1024)
                domClass.remove("legendButton", "active");
            else
                query('#legendModal').style('display', 'block');

            query('#legendModal .modal-header button.close').on('click', function (e){
                domClass.remove("legendButton", "active");
                fadeOutLegend.play();
            });

            var fadeInLegend = fx.fadeIn({node:'legendModal'});
            var fadeOutLegend = fx.fadeOut({node:'legendModal'});

            on(fadeOutLegend, 'End', function(){
                query('#legendModal').style('display', 'none');
            });

            on(fadeInLegend, 'End', function(){
                query('#legendModal').style('display', 'block');
            });

            query('#legendButton').on('click', function (e){
                if (query('#legendModal').style('display') == 'none') {
                    domClass.add("legendButton", "active");
                    query('#legendModal').style('display', 'block');
                    fadeInLegend.play();
                }
                else {
                    domClass.remove("legendButton", "active");
                    fadeOutLegend.play();
                }
            });

            query('#shareModal').modal({
                show        : false
            });

            query('#shareButton').on('click', function (e){
                query('#shareModal').modal('show');
                share();
            });

            query('#feedbackModal').modal({
                show        : false
            });

            query('#feedbackButton').on('click', function (e){
                query('#feedbackModal').modal('show');
                share();
            });

            query('.btn').on('click', function (e){
                focusUtil.curNode && focusUtil.curNode.blur();
            });

            on(query('.sub-theme-buttons button'), 'click', function (e){
                changeSubTheme(parseInt(e.currentTarget.id.substring(e.currentTarget.id.length - 1), 10));
            });

            on(query('#printButton'), 'click', function (e){
                query(e.target).button('loading');
                print();
            });

            updateAboutText(0);

            app.oldZoomLevel = app.currentMap.getLevel();

            query('#radioWrapper button').on('click', function(e){
                radioClick(dojo.attr(this, 'data-id'));
            });

            //get print templates from the export web map task
            var printInfo = EsriRequest({
                url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
                content: { f: "json" }
            });
        }

        function createLegend(layerInfos, i)
        {
            var legendContentDiv = query('#legend .modal-body')[0];
            var legendDivHTML = '<div id="legendDiv' + i + '" class="legendDiv' + (i == 0 ? ' active"' : '"') + '></div>';
            domConstruct.place(legendDivHTML, legendContentDiv);
            var legend = new Legend({
                map         : app.maps[i],
                layerInfos  : layerInfos,
                autoUpdate  : false
            }, 'legendDiv' + i);
            legend.startup();
            app.maps[i].legend = legend;
        }

        function createSubThemeButtons()
        {
            var subThemes = '<div class="button-container"><div class="btn-group sub-theme-buttons" data-toggle="buttons-radio">';
            array.forEach(configOptions.themes[app.themeIndex].maps, function (map, i){
                subThemes += '<button type="button" id="subThemeButton' + i + '" class="btn btn-default' + (i === 0 ? ' active' : '') + '">' + map.title + '</button>';
            });
            subThemes += '</div></div>';
            domConstruct.place(subThemes, 'map-pane');
        }

        function updateNotice() 
        {
            if (subThemeName == 'Navigation'){
                if (app.map.getLevel() < 12) 
                    query('.notice').place("Zoom in to view 'Aids to Navigation'").style('display', 'block');
                else 
                    query('.notice').style('display', 'none');
            }
            else if (subThemeName == 'Potential Hazards'){
                if (app.map.getLevel() < 10) 
                    query('.notice').place("Zoom in to view 'Submarine Cable and Pipline Areas'").style('display', 'block');
                else 
                    query('.notice').style('display', 'none');
            }
        }

        function changeSubTheme(mapIndex) 
        {
            var menuWidth, currentMapIndex = app.currentMapIndex;

            var fadeOutLayers = fx.fadeOut({node:'map' + app.currentMapIndex}),
                //fadeOutLegend = fx.fadeOut({node: 'legendDiv' + app.currentMapIndex}),
                fadeInLayers = fx.fadeIn({node:'map' + mapIndex});
                //fadeInLegend = fx.fadeIn({node: 'legendDiv' + mapIndex}),
                //fadeOutRadio = fx.fadeOut({node: 'radioWrapper'}),
                //fadeInRadio = fx.fadeIn({node: 'radioWrapper'});

            switch (mapIndex){
                case 0:
                    //aboutBox_setContent(1791);
                    updateNotice();
                    //$j('a#flex-link').attr('href', 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,26,27,28,29,30,31,32,33;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#');
                    menuWidth = 296;
                    break;
                case 1:
                    //aboutBox_setContent(1822);
                    updateNotice();
                    //$j('a#flex-link').attr('href', 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,13,14,15,19,24,25;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#');
                    menuWidth = 201;
                    break;
                case 2:
                    //aboutBox_setContent(1827);
                    //radioClick(radioSelection);
                    menuWidth = 246;
                    break;
            }

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

            coreFx.combine([fadeOutLayers, /*fadeOutLegend,*/ fadeInLayers/*, fadeInLegend*/]).play();


            domClass.remove('legendDiv' + currentMapIndex, 'active');
            domClass.add('legendDiv' + mapIndex, 'active');
            query('#legendModal').style('width', menuWidth + 'px');
            if (mapIndex != '2')
                domClass.remove('radioWrapper', 'active');
                //fadeOutRadio.play();
            else
                domClass.add('radioWrapper', 'active');
                //fadeInRadio.play();

            updateAboutText(mapIndex);

            // query('#legendModal').style('width', menuWidth + 'px');
            // behavior.apply();

            app.currentMapIndex = mapIndex;
            app.currentMap = app.maps[mapIndex];
            app.currentMap.legend.refresh();
            behavior.apply();
        }

        function updateAboutText (mapIndex)
        {
            query('#overview p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[mapIndex].about.overview;
            query('#data-considerations p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[mapIndex].about.dataConsiderations;
            query('#status p')[0].innerHTML = configOptions.themes[app.themeIndex].maps[mapIndex].about.status;
        }

        function radioClick(id) 
        {
            app.currentMap.layer.setVisibleLayers([id]);
            radioSelection = id;
            app.currentMap.legend.refresh();
            behavior.apply();
        }

        function updateLegend()
        {
            var delayedFunction = window.setTimeout(function (e){
                array.forEach(configOptions.themes[app.themeIndex].maps, function (map){
                    if (map.layers.hasOwnProperty("dynamicLayers"))
                        array.forEach(map.layers.dynamicLayers, function (dynamicLayer) {
                            array.forEach(dynamicLayer.layers, function (layer, i) {
                                var td = query('.esriLegendService div table.esriLegendLayerLabel tr td:contains("' + layer.name + '")')
                                if (td.text() == layer.name)
                                    td.html('<a href="' + layer.metadata + '" target="_blank" rel="tooltip" data-toggle="tooltip" data-placement="right" title="' + layer.description +  ' <br /><br />Click layer for metadata">' + layer.name + '</a>');
                            });
                        });
                });
                query('.esriLegendService').tooltip({selector: 'a[rel="tooltip"]'});
            }, 50);
        }

        function isMobile() {(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))mobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
        }

        return {
            init: init
        }
    }
);