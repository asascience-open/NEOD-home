var app;
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
            aboutLayerOpen = false, watershed, scalebar, subThemeName, mapName, layerArray, mobile = false,
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

        var visible = [];
        radioSelection = 34,
        layers = [
        {
            label       : 'Maintained Channels',
            id          : 28,
            group       : 'navigation',
            outField    : 'location',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/MaintainedChannels.pdf'
        }, {
            label       : 'Danger Zone and Restricted Areas',
            id          : 30,
            group       : 'navigation',
            outField    : 'description',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/DangerZoneAndRestrictedAreas.pdf'
        }, {
            label       : 'Safety, Security, and Regulated Zones',
            id          : 31,
            group       : 'navigation',
            outField    : 'designation',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/SafetySecurityRegulatedAreas.pdf'
        }, {
            label       : 'WhalesNorth Mandatory Ship Reporting System',
            id          : 32,
            group       : 'navigation',
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf'
        },{
            label       : 'Marine Mammal Seasonal Management Areas',
            id          : 33,
            group       : 'navigation',
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/MarineMammalSeasonalAreas.pdf'
        }, {
            label       : 'Marine Transportation',
            id          : 29,
            group       : 'navigation',
            outField    : 'description',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/MarineTransportation.pdf'
        }, {
            label       : 'Pilot Boarding Areas',
            id          : 26,
            outField    : 'boardingArea',
            group       : 'navigation',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/PilotBoardingAreas.pdf'
        }, {
            label       : 'Anchorages',
            id          : 27,
            outField    : 'description',
            group       : 'navigation',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/Anchorages.pdf'
        }, {
            label       : 'Aids to Navigation',
            id          : 23,
            group       : 'navigation',
            outField    : 'aidName',
            visible     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/AidsToNavigation.pdf'
        }, {
            label       : 'Unexploded Ordnance Locations',
            id          : 24,
            group       : 'hazard',
            outField    : 'description',
            visible     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/UnexplodedOrdnanceLocations.pdf'
        }, {
            label       : 'Unexploded Ordnance Areas',
            id          : 25,
            group       : 'hazard',
            outField    : 'description',
            visible     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/UnexplodedOrdnanceAreas.pdf'
        }, {
            label       : 'Ocean Disposal Sites',
            id          : 19,
            group       : 'hazard',
            outField    : 'description',
            visible     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/OceanDisposalSites.pdf'
        }, {
            label       : 'Submarine Cables',
            id          : 13,
            group       : 'hazard',
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/SubmarineCables'
        }, {
            label       : 'Submarine Cable Areas',
            id          : 14,
            group       : 'hazard',
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/CableAreas'
        }, {
            label       : 'Submarine Pipeline Areas',
            id          : 15,
            group       : 'hazard',
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'OceanUses/PipelineAreas'
        }, {
            label       : '2011 All AIS Vessel Density',
            id          : 34,
            group       : 'traffic',
            checked     : true,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTotalAISVesselDensity2011.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2011 Cargo AIS Vessel Density',
            id          : 35,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticCargoAISVesselDensity2011.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=35;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2011 Passenger AIS Vessel Density',
            id          : 36,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticPassengerAISVesselDensity2011.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=36;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2011 Tug-Tow AIS Vessel Density',
            id          : 37,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTugTowAISVesselDensity2011.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=37;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2011 Tanker AIS Vessel Density',
            id          : 38,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTankerAISVesselDensity2011.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=38;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'

        }, {
            label       : '2012 All AIS Vessel Density',
            id          : 39,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTotalAISVesselDensity2012.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=39;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2012 Cargo AIS Vessel Density',
            id          : 40,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticCargoAISVesselDensity2012.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=40;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2012 Passenger AIS Vessel Density',
            id          : 41,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=41;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2012 Tug-Tow AIS Vessel Density',
            id          : 42,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=42;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
        }, {
            label       : '2012 Tanker AIS Vessel Density',
            id          : 43,
            group       : 'traffic',
            checked     : false,
            url         : oceanUsesUrl,
            metadata    : metaUrl + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf',
            flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=43;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
            }
        ];

        function init()
        {
            app = {};

            resizeMap();

            if (mapUrl.match(/yellahoose/i))
                energy = '1120', fishing = '1779', recreation = '1650', shellfish = '1652',
                mammals = '1380', wq = '2139', aqua = '1122';

            esri.config.defaults.io.proxyUrl = "http://services.asascience.com/Proxy/esriproxy/proxy.ashx";

            createMap();

            app.map.currentSubTheme = 0;

            app.map.layer = new esri.layers.ArcGISDynamicMapServiceLayer(oceanUsesUrl, {disableClientCaching : true, id : 'oceanUses'});
                for(var i = 0; i < layers.length; i++)
                    if (layers[i].group == 'navigation')
                        visible.push(layers[i].id);

            app.map.layer.setVisibleLayers(visible);

            app.map.addLayers([app.map.layer]);

            var layerInfos = [{layer:app.map.layer}];

            app.map.on('layers-add-result', function () {
                createLegend(layerInfos);
            });

            createRadioAndHover();

            behavior.add({
                '.esriLegendService' : {
                    found: function(){updateLegend();}
                }
            });


            notify('done',function(responseOrError){
                if (responseOrError.hasOwnProperty('url'))
                    if (responseOrError.url.match(/legend/i))
                        behavior.apply();
            });

            mapName = 'Maritime Commerce';
            subThemeName = 'Navigation';

            query('#overview p')[0].innerHTML = "This map shows boundaries and designations that define the basic marine transportation system for commercial and recreational vessels in the region.";
            query('#data-considerations p')[0].innerHTML = "Most of the features on the map are officially designated and actively maintained by the U.S. Coast Guard or the U.S. Navy, and their locations are well established. Examples include Anchorages; Maintained Channels; Safety, Security, and Regulated Zones; Danger Zone and Restricted Areas; and WhalesNorth Mandatory Ship Reporting System.<br /><br />Some of the Pilot Boarding Areas on the map are not designated by federal or state government authorities. However, they are well known and considered important by the maritime commerce sector.";
            query('#status p')[0].innerHTML = "We are working with the U.S. Coast Guard, Bureau of Ocean Energy Management, National Oceanic and Atmospheric Administration, and the maritime commerce community to verify and enhance the datasets, such as by identifying additional areas that are important for marine operations.";
        }

        function resizeMap()
        {
            screenHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            screenWidth = "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
            headerOffset = query('.navbar').style('height')[0];
            query('#mapDiv').style({
                'height'        : (screenHeight - headerOffset) + 'px',
                'marginTop'    : screenWidth < 980 ? '0' : headerOffset + 'px'
            });
        }

        window.onresize = function(event) {
            resizeMap();
        };

        function createRadioAndHover (){

            layerArray = [];

            for (i = 0; i < layers.length; i++)
            {
                /* get layer descriptions
                ========================== */
                var getlayerInfo = EsriRequest({
                    url: layers[i].url + layers[i].id,
                    content: {
                        f: "json",
                        returnGeometry: false
                    },
                    handleAs: "json",
                    callbackParamName: "callback"
                });

                getlayerInfo.then(
                    function(data) {
                        layerArray.push(data);
                        if (layerArray.length == layers.length)
                            setDescriptions();
                    }, function(error) {
                        console.log("Error: ", error.message);
                });

                /* create feature layers
                ========================== */
                if (layers[i].outField != null) {
                    if (layers[i].defExpression == null)
                        createFeatureLayer(layers[i].id, layers[i].outField, layers[i].visible, layers[i].url, layers[i].group, null);
                    else
                        createFeatureLayer(layers[i].id, layers[i].outField, layers[i].visible, layers[i].url, layers[i].group, layers[i].defExpression);
                }

                /* create radio buttons
                ========================== */
                if (layers[i].checked != null) {
                    dojo.place("<button data-id='" + layers[i].id + "' class='btn" + (layers[i].checked ? " active" : " ") + "'>" 
                        + layers[i].label + "</button>"
                        , "radioWrapper");

                    // radio = new RadioButton({
                    //     id          : 'radio_' + layers[i].id,
                    //     label       : layers[i].label,
                    //     value       : layers[i].id,
                    //     name        : layers[i].group,
                    //     'class'     : layers[i].group,
                    //     checked     : layers[i].checked,
                    //     onClick     : mapUrl.indexOf(fishing) > 0 ? function (e) {
                    //                     updateLayer(this.value);
                    //                     switch(this.value){
                    //                         // case 0:
                    //                         //  neo_set_about_box_text('All fisheries CMS point density 2006-2010');
                    //                         //  break;
                    //                         case 47:
                    //                             neo_set_about_box_text('Multispecies VMS point density 2006-2010');
                    //                             break;
                    //                         case 48:
                    //                             neo_set_about_box_text('Monkfish VMS point density 2006-2010');
                    //                             break;
                    //                         // case 3:
                    //                         //  neo_set_about_box_text('Herring VMS point density 2006-2010');
                    //                         //  break;
                    //                         case 49:
                    //                             neo_set_about_box_text('Surf clam/Quahog VMS point density 2006-2010');
                    //                             break;
                    //                         case 50:
                    //                             neo_set_about_box_text('Scallop VMS point density 2006-2010');
                    //                             break;
                    //                     }
                    //                   } : function(e) {
                    //                     updateLayer(this.value);
                    //                   }
                    // }, dojo.create('input', null, dojo.byId('radioWrapper')));
                    // dojo.create('label', { 'for' : 'radio_' + layers[i].id , innerHTML : layers[i].label, 'class' : layers[i].group }, dojo.byId('radioWrapper'));
                }
            }

            /* feature layer mouseover functionality
            ======================================== */
            for (i = 0; i < featureLayers.length; i++)
            {
                if (mapUrl.indexOf(wq) > 0 && (featureLayers[i].className == 'impaired' || featureLayers[i].className == 'facilities')) {
                    featureLayers[i].on('click', function (e) {
                        var g = e.graphic,
                            c = g.getContent();
                        if (g._graphicsLayer.url == 'http://geodata.epa.gov/arcgis/rest/services/OEI/FRS_INTERESTS/MapServer/15') {
                            app.map.infoWindow.setTitle('Facilities that Discharge to Water Point');
                            app.map.infoWindow.setContent('<a href="' + g.attributes.FAC_URL + '" target="_blank">' + g.attributes.PRIMARY_NAME + '</a>');
                            //$j('.esriPopup .titlePane').css('width', 'auto');
                            //$j('.esriPopup .titlePane').width($j('.esriPopup .titlePane').width() + 20);
                        }
                        else {
                            app.map.infoWindow.setTitle(g._graphicsLayer.name);
                            app.map.infoWindow.setContent('<a href="' + c + '" target="_blank">Waterbody Report</a>');
                            //$j('.esriPopup .titlePane').css('width', '156px');
                        }
                        //$j('.esriPopup .titleButton.close').show();
                        app.map.infoWindow.show(e.screenPoint, app.map.getInfoWindowAnchor(e.screenPoint));
                    });
                }
                else {
                    featureLayers[i].on('mouse-over', function(e){
                        var g = e.graphic;
                        if (g.getContent() != '999999' && e.graphic._graphicsLayer.visible == true){
                            //$j('.esriPopup .titleButton.close').hide();
                            //$j('.esriPopup .titlePane').css('width', 'auto');
                            app.map.infoWindow.setTitle(g._graphicsLayer.name);
                            if (mapUrl.indexOf(energy) > 0 && cm == 1){
                                if (g._graphicsLayer.name == 'Block Island Renewable Energy Zone')
                                    app.map.infoWindow.setContent('Area selected for offshore renewable energy development');
                                else if (g._graphicsLayer.name == 'Block Island Proposed Turbine Locations')
                                    app.map.infoWindow.setContent('Proposed turbine location');
                                else
                                    app.map.infoWindow.setContent(g.getContent());
                            }
                            else if (mapUrl.indexOf(aqua) > 0 && cm == 1 && radioSelection == 5){
                                var code = g.getContent(),
                                    label = '';
                                switch(code){
                                    case 'gr':
                                        label = 'Gravel';
                                        break;
                                    case 'gr-sd':
                                        label = 'Gravel-Sand';
                                        break;
                                    case 'sd':
                                        label = 'Sand';
                                        break;
                                    case 'sd/st/cl':
                                        label = 'Sand/Silt/Clay';
                                        break;
                                    case 'sd-st/cl':
                                        label = 'Sand-Silt/Clay';
                                        break;
                                    case 'cl-st/sd':
                                        label = 'Clay-Silt/Sand';
                                        break;
                                    case 'sd-cl/st':
                                        label = 'Sand-Clay/Silt';
                                        break;
                                    case 'cl':
                                        label = 'Clay';
                                        break;
                                    case 'br':
                                        label = 'Bedrock';
                                        break;
                                }
                                app.map.infoWindow.setContent(label);
                            }
                            else
                                app.map.infoWindow.setContent(g.getContent());
                            app.map.infoWindow.show(e.screenPoint, app.map.getInfoWindowAnchor(e.screenPoint));
                        }
                    });

                    featureLayers[i].on('mouse-out', function(){
                        app.map.infoWindow.hide();
                    });
                }
            }
            query('#radioWrapper button').on('click', function(e){
                radioClick(dojo.attr(this, 'data-id'));
            });
        }

        function createFeatureLayer(id, outField, visible, layerURL, group, defExpression){
            if (mapUrl.indexOf(shellfish) > 0 && defExpression != null) {
                var featureLayer = new FeatureLayer(layerURL + 59, {
                    infoTemplate: new InfoTemplate('', '${' + outField + '}'),
                    outFields: [outField],
                    visible: visible,
                    opacity: 0.0,
                    className: group
                });
                featureLayer.setDefinitionExpression(defExpression);
            }
            else if (mapUrl.indexOf(wq) > 0 && id == 15 && layerURL == geodataUrl) {
                var featureLayer = new FeatureLayer(layerURL + id, {
                    infoTemplate: new InfoTemplate(),
                    outFields: ['PRIMARY_NAME', 'FAC_URL'],
                    visible: visible,
                    opacity: 0.0,
                    className: group
                });
            }
            else if (defExpression == null) {
                var featureLayer = new FeatureLayer(layerURL + id, {
                    infoTemplate: new InfoTemplate('', '${' + outField + '}'),
                    outFields: [outField],
                    visible: visible,
                    opacity: 0.0,
                    className: group
                });
            }
            featureLayers.push(featureLayer);
            app.map.addLayer(featureLayer);
        }

        function print() 
        {
            query('#loading').style('display', 'block');

            var params = new PrintParameters();
            var template = new PrintTemplate();

            var legendLayers = [];
            for (var i = 1; i < app.map.layerIds.length; i++){
                var legendLayer = new LegendLayer();
                legendLayer.layerId = app.map.layerIds[i];
                legendLayers.push(legendLayer);
            }   
            
            template.format = "png32";          
            template.layout = "A3 Landscape";           
            template.preserveScale = false;
            template.layoutOptions = {};
            
            template.layoutOptions.titleText = mapName + ' | ' + subThemeName;
            template.layoutOptions.authorText = 'Northeast Ocean Data Portal';
            template.layoutOptions.legendLayers = legendLayers;

            params.template = template;
            params.map = app.map;

            var printTask = new PrintTask("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task", params);

            printTask.execute(params, function printTaskCallback(result) {
                window.open(result.url);
                query('#printButton').button('reset');
                query('#loading').style('display', 'none');
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
                        app.map.setBasemap('oceans');
                        chart.hide();
                        break;
                    case 'satellite':
                        app.map.setBasemap('satellite');
                        chart.hide();
                        break;
                    case 'chart':
                        chart.show();
                        var basemapLayerID = app.map.basemapLayerIds[0];
                        for (var prop in app.map._layers)
                            if (prop == basemapLayerID)
                                app.map._layers[prop].hide();
                        app.map._basemap = 'chart';
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
                        app.map.centerAndZoom(new Point(-70.5, 42), 7);
                        break;
                    case 'Cape Cod':
                        app.map.centerAndZoom(new Point(-70.261903, 41.797936), 10);
                        break;
                    case 'Gulf of Maine':
                        app.map.centerAndZoom(new Point(-68.901615, 42.851806), 8);
                        break;
                    case 'Long Island Sound':
                        app.map.centerAndZoom(new Point(-72.824464, 41.111434), 10);
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
            // create map
            app.map = new Map('mapDiv',{
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

            domConstruct.place("<img src='img/loading.gif' id='loading' />"
            + "<div id='watermark'>Northeast Ocean Data</div>"
            + "<span id='scale'></span>"
            + "<div id='mapControls' class='btn-group'><div class='btn-group' id='zoomToDropdownDiv'><button class='btn dropdown-toggle btn-primary dropdown no-top-left-border-radius no-top-right-border-radius no-bottom-right-border-radius' id='zoomToDropdown' href='#' data-toggle='dropdown'>"
            + "Zoom to<span class='caret'></span></button>"
            + "<ul class='dropdown-menu' id='zoomToDropdownList'></ul></div>"
            + "<div class='btn-group' id='basemapDropdownDiv'><button class='btn dropdown-toggle btn-primary dropdown no-border-radius' id='basemapDropdown' href='#' data-toggle='dropdown'>"
            + "Basemaps<span class='caret'></span></button>"
            + "<ul class='dropdown-menu' id='basemapDropdownList'></ul></div>"
            + "<button class='btn btn-primary' id='shareButton'>Share</button>"
            + "<button class='btn btn-primary no-top-right-border-radius' data-loading-text='Loading...' id='printButton'>Print</button></div></div>"
            + "<div id='side-buttons'>"
            + "<button href='#legendModal' type='button' id='legendButton' class='btn btn-neod active no-bottom-border-radius'>Legend / About</button>"
            //+ "<button type='button' id='aboutButton' href='#aboutModal' data-toggle='modal' class='btn btn-neod no-bottom-border-radius' data-toggle='button'>About</button>"
            + "<button type='button' id='feedbackButton' class='btn btn-neod no-bottom-border-radius'>Feedback</button></div>" +
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
                        "<div class='modal-body'>" +
                            "<div id='radioWrapper' class='btn-group-vertical' data-toggle='buttons-radio'></div>" +
                            "<div id='legendDiv'></div>" +
                        "</div>" +
                        "<div class='modal-footer'><a id='flex-link' href='#'>View this data with other layers</a></div>" +
                    "</div>" +
                    "<div id='about' class='modal-body tab-pane fade'>" +
                        "<strong>Overview</strong><div id='overview'><p>blah</p></div>" +
                        "<strong>Data Considerations</strong><div id='data-considerations'><p>blah</p></div>" +
                        "<strong>Status</strong><div id='status'><p>blah</p></div>" +
                    "</div>" +
                "</div>" +
            "</div>"
            // + "<div id='aboutModal' class='modal' role='dialog' data-backdrop='false'>"
            // + "<div class='modal-header'>"
            // + "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'><span class='icon-remove'></span></button>"
            // + "<h5>About this Map</h5><!--<div class='alert alert-info'>Zoom-in to view hidden layer(s).</div>-->"
            // + "</div><div class='modal-body'></div></div>"
            , "mapDiv_root");

            app.map.on('update-start', function(){
                query('#loading').style("display", "block");
            });
            
            app.map.on('update-end', function(){
                //share();
                query('#loading').style("display", "none");
            });


            app.map.on('zoom-end', function(e){
                if (app.map.currentSubTheme == 0) {
                    updateNotice();
                    if (e.level >= 12 && app.map.oldZoomLevel < 12) {
                        app.map.legend.refresh();
                        behavior.apply();
                    }
                    else if (e.level < 12 && app.map.oldZoomLevel >= 12) {
                        app.map.legend.refresh();
                        behavior.apply();
                    }
                }
                else if (app.map.currentSubTheme == 1) {
                    updateNotice();
                    if (e.level >= 10 && app.map.oldZoomLevel < 10) {
                        app.map.legend.refresh();
                        behavior.apply();
                    }
                    else if (e.level < 10 && app.map.oldZoomLevel >= 10) {
                        app.map.legend.refresh();
                        behavior.apply();
                    }
                }
                if (e.level == 14) {
                     var point = new esri.geometry.Point(app.map.extent.getCenter());
                     if (point.x > -7754990.997596861) {
                         if (osmLayer == null) {
                             osmLayer = new esri.layers.OpenStreetMapLayer();
                             app.map.addLayer(osmLayer, 1);
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
                    app.map.oldZoomLevel = e.level;
            });

            app.map.on('extent-change', function(e){
                query('#scale')[0].innerHTML = "Scale 1:" + e.lod.scale.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            });

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

            var scalebar = new Scalebar({
                map         : app.map,
                attachTo    : 'bottom-right'//,
                //scalebarUnit: 'dual'
            });

            app.map.on('load', function () {
                chart = new ArcGISImageServiceLayer('http://egisws02.nos.noaa.gov/ArcGIS/rest/services/RNC/NOAA_RNC/ImageServer', 'chart');
                app.map.addLayer(chart, 1);
                chart.hide();
                createBasemapGallery();
                var href = mapUrl;
                // if (href.indexOf("&z") > 0) {
                //     var hrefArray = href.substring(href.indexOf("z")).split('&');
                //     var bmap = hrefArray[1].substring(hrefArray[1].indexOf("=") + 1);
                //     if (bmap == "chart") {
                //         chart.show();
                //         var basemapLayerID = map.basemapLayerIds[0];
                //         for (var prop in map._layers)
                //             if (prop == basemapLayerID)
                //                 map._layers[prop].hide();
                //         map.setBasemap('chart');
                //     }
                //     else
                //         map.setBasemap(bmap);
                //     radioSelection = parseInt(hrefArray[3].substring(hrefArray[3].indexOf("=") + 1));
                //     if ($j('#radio_' + radioSelection).length > 0)
                //         dijit.byId('radio_' + radioSelection).set('checked', true);
                //     var point = new esri.geometry.Point([hrefArray[4].substring(hrefArray[4].indexOf("=") + 1), hrefArray[5].substring(hrefArray[5].indexOf("=") + 1).replace('#', '')], map.spatialReference);
                //     map.centerAndZoom(new esri.geometry.Point(point.getLongitude(), point.getLatitude()), hrefArray[0].substring(hrefArray[0].indexOf("=") + 1));
                //     changeMap(parseInt(hrefArray[2].substring(hrefArray[2].indexOf("=") + 1), 10));
                //     if (window.location.href.indexOf(energy) > 0 )
                //         if (radioSelection == 3)
                //             dijit.byId("sliderWrapper2").set("value", parseFloat(hrefArray[6].substring(hrefArray[6].indexOf("=") + 1)));
                //         else
                //             dijit.byId("sliderWrapper1").set("value", parseFloat(hrefArray[6].substring(hrefArray[6].indexOf("=") + 1)));
                // }
                //neodShowHideBox('legend', 'whatever', true);
                //$j('img#legend-img').attr('src', 'images/legend-tab-out-on.png');
                //$j('.tab').show();
                firstLoad = false;
                // if (navigator.userAgent.match(/msie 7.0/i))
                //     if ($j('label').length > 0)
                //         $j.each(jQuery('label'), function (i, v) {
                //             $j(v).after('<div style="clear:both;"></div>');
                //         });
                //$j('#dropdownWrapper').show();
                //checkLegendHeight();
                //createLayerLinks();
                app.currentMapIndex = 0;
                app.map.oldZoomLevel = app.map.getLevel();
                if (mobile) {
                    dojo.style(dojo.byId("mapDiv_zoom_slider"), "display", "none");
                    dojo.style(dojo.byId("watermark"), "display", "none");
                }
            });

            //cm = 0;

            createSubThemeButtons(['Navigation', 'Potential Hazards', 'Commercial Traffic']);

            var constraintBox = {
                        l:  0,
                        t:  0,
                        w:  screenWidth,
                        h:  query('#mapDiv_root').style('height')[0]
                    };

            var moveableLegend =  new move.constrainedMoveable("legendModal", {
                within: true,
                constraints: function(){return constraintBox;}
            });

            query('#mapCarousel').carousel({interval: false});

            query('#mapCarousel button').on('click', function(e){
                domClass.remove(query('#mapCarousel button.btn.active')[0], 'active');
                domClass.add(query(e.target), 'active');
            });

            if (screenWidth < 1024)
                domClass.remove("legendButton", "active");
            else
                query('#legendModal').style('display', 'block');

            query('#legendModal .modal-header button.close').on('click', function(e){
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

            query('#legendButton').on('click', function(e){
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

            query('#shareButton').on('click', function(e){
                query('#shareModal').modal('show');
                share();
            });

            query('#feedbackModal').modal({
                show        : false
            });

            query('#feedbackButton').on('click', function(e){
                query('#feedbackModal').modal('show');
                share();
            });

            query('.btn').on('click', function(e){
                focusUtil.curNode && focusUtil.curNode.blur();
            });

            on(query('.sub-theme-buttons button'), 'click', function(e){
                changeSubTheme(parseInt(e.currentTarget.id.substring(e.currentTarget.id.length - 1), 10));
            });

            on(query('#printButton'), 'click', function(e){
                query(e.target).button('loading');
                print();
            });


            //get print templates from the export web map task
            var printInfo = EsriRequest({
                url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
                content: { f: "json" }
            });
        }

        function createLegend(layerInfos){
            app.map.legend = new Legend({
                map         : app.map,
                layerInfos  : layerInfos,
                autoUpdate  : false
            }, "legendDiv");
            app.map.legend.startup();
        }

        function hideFeatureLayers()
        {
            for(var i = 0; i < featureLayers.length; i++)
                if (featureLayers[i].visible === true)
                    featureLayers[i].hide();
        }

        function createSubThemeButtons(titles)
        {
            var subThemes = '<div class="button-container"><div class="btn-group sub-theme-buttons" data-toggle="buttons-radio">';
            array.forEach(titles, function(title, i){
                subThemes += '<button type="button" id="subThemeButton' + i + '" class="btn btn-neod' + (i == 0 ? ' active no-top-left-border-radius' : (i == titles.length - 1 ? ' no-top-right-border-radius' : '')) + '">' + title + '</button>';
            });
            subThemes += '</div></div>';
            domConstruct.place(subThemes, 'mapDiv_root');
        }


/**********************************************************************************************************/

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

        function changeSubTheme(subThemeIndex) {
            hideFeatureLayers();
            app.map.layer.setVisibleLayers([-1]);
            visible = [];
            
            var menuWidth;
            
            switch (subThemeIndex){
                case 0:
                    for(var i = 0; i < layers.length; i++)
                        if (layers[i].group == 'navigation')
                            visible.push(layers[i].id);
                    app.map.layer.setVisibleLayers(visible);
                    for (var i = 0; i < featureLayers.length; i++){
                        if (featureLayers[i].className == 'navigation')
                            featureLayers[i].show();
                    }
                    updateNotice();
                    //$j('a#flex-link').attr('href', 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,26,27,28,29,30,31,32,33;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#');
                    menuWidth = 298;
                    query('#overview p')[0].innerHTML = "This map shows boundaries and designations that define the basic marine transportation system for commercial and recreational vessels in the region.";
                    query('#data-considerations p')[0].innerHTML = "Most of the features on the map are officially designated and actively maintained by the U.S. Coast Guard or the U.S. Navy, and their locations are well established. Examples include Anchorages; Maintained Channels; Safety, Security, and Regulated Zones; Danger Zone and Restricted Areas; and WhalesNorth Mandatory Ship Reporting System.<br /><br />Some of the Pilot Boarding Areas on the map are not designated by federal or state government authorities. However, they are well known and considered important by the maritime commerce sector.";
                    query('#status p')[0].innerHTML = "We are working with the U.S. Coast Guard, Bureau of Ocean Energy Management, National Oceanic and Atmospheric Administration, and the maritime commerce community to verify and enhance the datasets, such as by identifying additional areas that are important for marine operations.";
                    break;
                case 1:
                    for(var i = 0; i < layers.length; i++)
                        if (layers[i].group == 'hazard')
                            visible.push(layers[i].id);
                    app.map.layer.setVisibleLayers(visible);
                    for (var i = 0; i < featureLayers.length; i++){
                        if (featureLayers[i].className == 'hazard')
                            featureLayers[i].show();
                    }
                    updateNotice();
                    //$j('a#flex-link').attr('href', 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,13,14,15,19,24,25;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#');
                    menuWidth = 207;
                    query('#overview p')[0].innerHTML = "This map shows the locations of some potential hazards on the seabed, including unexploded ordnance, disposal sites, cables, and pipelines.";
                    query('#data-considerations p')[0].innerHTML = "This map can be used to help identify areas of risk to human health and property. People should take caution with the use of these data and recognize that the original sources are known to be incomplete.";
                    query('#status p')[0].innerHTML = "We are actively working with the telecommunications industry to improve the submarine cable layer. We are not planning updates to the other datasets at this time.";
                    break;
                case 2:
                    radioClick(radioSelection);
                    menuWidth = 251;
                    query('#radioWrapper').style('display', 'block');
                    query('#overview p')[0].innerHTML = "This map shows the concentration of commercial vessel traffic in 2011 for cargo, tanker, tug and tow, passenger, and all vessels, based on data received from Automatic Identification Systems (AIS).";
                    query('#data-considerations p')[0].innerHTML = "AIS are navigation safety devices that monitor and transmit the locations and characteristics of vessels in U.S. and international waters. All vessels 300 gross tons and above (except military) are required by the International Maritime Organization to carry an AIS transponder. For this map, vessel tracks were derived from raw AIS data provided by the U.S. Coast Guard. The vessel tracklines were then used to generate density grids to better display the patterns of vessel activity by vessel type. Accuracy and completeness of AIS data can be affected by transponder reception range, which varies with changes in atmosphere, weather, and time of day.";
                    query('#status p')[0].innerHTML = "We are obtaining feedback from the U.S. Coast Guard, ports, and shipping industry about how additional information from AIS, such as vessel draft or data from additional years, may be used to help characterize commercial vessel activity.";
                    break;
            }

            query('#legendModal').style('width', menuWidth + 'px');

            app.map.legend.refresh();
            behavior.apply();
            if (subThemeIndex != 2)
                query('#radioWrapper').style('display', 'none');
            app.map.currentSubTheme = subThemeIndex;
        }

        function radioClick(id) 
        {
            app.map.layer.setVisibleLayers([id]);
            radioSelection = id;
            app.map.legend.refresh();
            behavior.apply();
        }

        function updateLegend()
        {
            var delayedFunction = window.setTimeout(function(e){
                array.forEach(layers, function(layer, i) {
                    var td = query('.esriLegendService div table.esriLegendLayerLabel tr td:contains("' + layer.label + '")')
                    if (td.text() == layer.label)
                        td.html('<a href="' + layers[i].metadata + '" target="_blank" rel="tooltip" data-toggle="tooltip" data-placement="right" title="' + layers[i].description +  ' <br /><br />Click layer for metadata">' + layers[i].label + '</a>');
                });
                query('.esriLegendService').tooltip({selector: 'a[rel="tooltip"]'});
            }, 50);
        }

        function setDescriptions() {
            array.forEach(layers, function(layer, i) {
                layer['description'] = layerArray[i].description;
            });
        }

        function isMobile() {(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))mobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
        }

        return {
            init: init
        }
    }
);