var metaUrl = 'http://www.northeastoceandata.org/files/metadata/';
var oceanUsesUrl = 'http://50.19.218.171/arcgis1/rest/services/OceanUses/MapServer/'
var energyMain = {
  subthemes: ['2012 Monthly AIS'],
  datalayers: [{
            label       : '2012 Monthly Tug Tow',
            id          : 0,
            group       : 'traffic',
            checked     : true,
            url         : 'http://gis.asascience.com/arcgis/rest/services/RegionalPortal/MonthlyTugTow2012/MapServer',
            metadata    : metaUrl + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf',
            outField    : 'location',
            visible     : true
            //flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=43;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
            },
            {
            label       : '2012 Monthly Tug Tow',
            id          : 1,
            group       : 'traffic',
            checked     : true,
            url         : 'http://gis.asascience.com/arcgis/rest/services/RegionalPortal/MonthlyTugTow2012/MapServer',
            metadata    : metaUrl + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf',
            outField    : 'location',
            visible     : true
            //flexLink    : 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=43;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#'
            }
        ]
    };
var maritimeComm = {
  subthemes:['Navigation', 'Potential Hazards', 'Commercial Traffic'],
  datalayers: [
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
        ]};