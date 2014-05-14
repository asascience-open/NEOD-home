define([],
	function ()
	{
		var serviceURL = "http://50.19.218.171/arcgis1/rest/services/",
			oceanUses = serviceURL + "OceanUses/MapServer/",
			metadataURL = "http://www.northeastoceandata.org/files/metadata/";
		configOptions = {
			themes: [
				{
					title: "Maritime Commerce",
					maps: [
						{
							title: "Navigation",
							menuWidth: 296,
							about: {
								overview: "This map shows boundaries and designations that define the basic marine transportation system for commercial and recreational vessels in the region.",
								dataConsiderations: "Most of the features on the map are officially designated and actively maintained by the U.S. Coast Guard or the U.S. Navy, and their locations are well established. Examples include Anchorages; Maintained Channels; Safety, Security, and Regulated Zones; Danger Zone and Restricted Areas; and WhalesNorth Mandatory Ship Reporting System.<br /><br />Some of the Pilot Boarding Areas on the map are not designated by federal or state government authorities. However, they are well known and considered important by the maritime commerce sector.",
								status: "We are working with the U.S. Coast Guard, Bureau of Ocean Energy Management, National Oceanic and Atmospheric Administration, and the maritime commerce community to verify and enhance the datasets, such as by identifying additional areas that are important for marine operations."
							},
							layers: {
								dynamicLayers: [
									{
										URL : oceanUses,
										layers: [
											{
												name: "Maintained Channels",
												ID: 28,
												metadata: metadataURL + "OceanUses/MaintainedChannels.pdf",
												outField: "location"
											},
											{
												name: "Danger Zone and Restricted Areas",
												ID: 30,
												metadata: metadataURL + "OceanUses/DangerZoneAndRestrictedAreas.pdf",
												outField: "description"
											},
											{
												name: "Safety, Security, and Regulated Zones",
												ID: 31,
												metadata: metadataURL + "OceanUses/SafetySecurityRegulatedAreas.pdf",
												outField: "designation"
											},
											{
												name: "WhalesNorth Mandatory Ship Reporting System",
												ID: 32,
												metadata: metadataURL + "OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf"
											},
											{
												name: "Marine Mammal Seasonal Management Areas",
												ID: 33,
												metadata: metadataURL + "OceanUses/MarineMammalSeasonalAreas.pdf"
											},
											{
												name: "Marine Transportation",
												ID: 29,
												metadata: metadataURL + "OceanUses/MarineTransportation.pdf",
												outField: "description"
											},
											{
												name: "Pilot Boarding Areas",
												ID: 26,
												metadata: metadataURL + "OceanUses/PilotBoardingAreas.pdf",
												outField: "boardingArea"
											},
											{
												name: "Anchorages",
												ID: 27,
												metadata: metadataURL + "OceanUses/Anchorages.pdf",
												outField: "description"
											},
											{
												name: "Aids to Navigation",
												ID: 23,
												metadata: metadataURL + "OceanUses/AidsToNavigation.pdf",
												outField: "aidName"
											}
										]
									}
								]
							}
						},
						{
							title: "Potential Hazards",
							menuWidth: 201,
							about: {
								overview: "This map shows the locations of some potential hazards on the seabed, including unexploded ordnance, disposal sites, cables, and pipelines.",
								dataConsiderations: "This map can be used to help identify areas of risk to human health and property. People should take caution with the use of these data and recognize that the original sources are known to be incomplete.",
								status: "We are actively working with the telecommunications industry to improve the submarine cable layer. We are not planning updates to the other datasets at this time."
							},
							layers: {
								dynamicLayers: [
									{
										URL: oceanUses,
										layers: [
											{
												name: "Unexploded Ordnance Locations",
												ID: 24,
												metadata: metadataURL + "OceanUses/UnexplodedOrdnanceLocations.pdf",
												outField: "description"
											},
											{
												name: "Unexploded Ordnance Areas",
												ID: 25,
												metadata: metadataURL + "OceanUses/UnexplodedOrdnanceAreas.pdf",
												outField: "description"
											},
											{
												name: "Ocean Disposal Sites",
												ID: 19,
												metadata: metadataURL + "OceanUses/OceanDisposalSites.pdf",
												outField: "description"
											},
											{
												name: "Submarine Cables",
												ID: 13,
												metadata: metadataURL + "OceanUses/SubmarineCables"
											},
											{
												name: "Submarine Cable Areas",
												ID: 14,
												metadata: metadataURL + "OceanUses/CableAreas"
											},
											{
												name: "Submarine Pipeline Areas",
												ID: 15,
												metadata: metadataURL + "OceanUses/PipelineAreas"
											}
										]
									}
								]
							}
						},
						{
							title: "Commercial Traffic",
							menuWidth: 246,
							about: {
								overview: "This map shows the concentration of commercial vessel traffic in 2011 for cargo, tanker, tug and tow, passenger, and all vessels, based on data received from Automatic Identification Systems (AIS).",
								dataConsiderations: "AIS are navigation safety devices that monitor and transmit the locations and characteristics of vessels in U.S. and international waters. All vessels 300 gross tons and above (except military) are required by the International Maritime Organization to carry an AIS transponder. For this map, vessel tracks were derived from raw AIS data provided by the U.S. Coast Guard. The vessel tracklines were then used to generate density grids to better display the patterns of vessel activity by vessel type. Accuracy and completeness of AIS data can be affected by transponder reception range, which varies with changes in atmosphere, weather, and time of day.",
								status: "We are obtaining feedback from the U.S. Coast Guard, ports, and shipping industry about how additional information from AIS, such as vessel draft or data from additional years, may be used to help characterize commercial vessel activity."
							},
							layers: {
								dynamicLayers: [
									{
										URL : oceanUses,
										layers : [
											{
												name: "2011 All AIS Vessel Density",
												ID: 34,
												metadata: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2011.pdf",
												checked: true,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2011 Cargo AIS Vessel Density",
												ID: 35,
												metadata: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2011 Passenger AIS Vessel Density",
												ID: 36,
												metadata: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tug-Tow AIS Vessel Density",
												ID: 37,
												metadata: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tanker AIS Vessel Density",
												ID: 38,
												metadata: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2012 All AIS Vessel Density",
												ID: 39,
												metadata: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2012 Cargo AIS Vessel Density",
												ID: 40,
												metadata: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2012 Passenger AIS Vessel Density",
												ID: 41,
												metadata: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tug-Tow AIS Vessel Density",
												ID: 42,
												metadata: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tanker AIS Vessel Density",
												ID: 43,
												metadata: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=cart=9999;demo=9999;physocean=9999;bio=9999;ocean=9999,34;admin=9999;hapc=9999;efh=9999;ngdc=9999;HereIsMyMap#"
											}
										]
									}
								]
							}
						}
					]
				},
				{
					title: "AIS TimeSlider",
					maps: [{
							title: "2012 Monthly AIS",
							menuWidth: 246,
							about: {
								overview: "This map shows AIS Data.",
								dataConsiderations: "ata from NOAA.",
								status: "This is a demo layer."
							},
							layers: {
								dynamicLayers: [
									{
										URL : "http://gis.asascience.com/arcgis/rest/services/RegionalPortal/MonthlyTugTow2012/MapServer/",
										layers: [
											{
												name: "2012 Monthly Tug Tow",
												ID: 0,
												showtimeSlider:true,
												metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
											},
											//This is for Legend
											{
												name: "2012 Monthly Tug Tow",
												ID: 1,
												metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
											}
										]
									}
								]
							}
						}]
				},
				{
					title: "Energy",
					maps: []
				},
				{
					title: "Recreation",
					maps: []
				},
				{
					title: "Commercial Fishing",
					maps: []
				},
				{
					title: "Aquaculture",
					maps: []
				}/*,
				{
					title: "Fish & Shellfish",
					maps: []
				},
				{
					title: "Marine Mammals & Sea Turtles",
					maps: []
				},
				{
					title: "Other Marine Life",
					maps: []
				},
				{
					title: "Water Quality",
					maps: []
				}*/
			],
			//Sync maps scale and location
			syncMaps: true,
			//Display geocoder search widget
			geocoderWidget: false,
			// Specify a proxy for custom deployment
			proxyurl: "",
			//specify the url to a geometry service
			geometryserviceurl: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
			//If the webmap uses Bing Maps data, you will need to provided your Bing Maps Key
			bingmapskey : "",
			//Modify this to point to your sharing service URL if you are using the portal
			sharingurl: "http://www.arcgis.com/sharing/rest/content/items"
		}
	}
);