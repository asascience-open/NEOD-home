define([],
	function ()
	{
		var serviceURL 			= "http://50.19.218.171/arcgis1/rest/services/",
			marineCadastre		= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/',
			oceanUses 			= serviceURL + "OceanUses/MapServer/",
			maritimeCommerce 	= serviceURL + 'SiteDev/MaritimeCommerce/MapServer/',
			aquaculture			= serviceURL + 'SiteDev/Aquaculture/MapServer/',
			otherMarineLife		= serviceURL + 'SiteDev/OtherMarineLife/MapServer/',
			fedFish				= serviceURL + 'OceanUses/FederalFisheryManagement/MapServer/',
			fishAndShellfish	= serviceURL + 'SiteDev/FishAndShellfish/MapServer/',
			monkfish			= serviceURL + 'OceanUses/VMSMonkfish2006To2011/MapServer/',
			multispecies		= serviceURL + 'OceanUses/VMSNortheastMultispecies2006To2011/MapServer/',
			scallop				= serviceURL + 'OceanUses/VMSScallop2006To2011/MapServer/',
			quahog				= serviceURL + 'OceanUses/VMSSurfClamQuahog2006To2011/MapServer/',
			energy				= serviceURL + 'SiteDev/Energy/MapServer/',
			recAndCulture		= serviceURL + 'SiteDev/RecreationAndCulture/MapServer/',
			securedLands		= serviceURL + 'SecuredLands2012/MapServer/',
			administrative		= serviceURL + 'Administrative/MapServer/',
			marineMammals		= serviceURL + 'SiteDev/MarineMammalsAndSeaTurtles/MapServer/',
			noaaEFH				= 'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/NMFS/EFHAreasProtectedFromFishing/MapServer/',
			noaaHAPC			= 'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/NMFS/HAPC/MapServer/',
			tncDemersal			= 'http://50.18.215.52/arcgis/rest/services/NAMERA/EUSD_NAM_DEMERSAL/MapServer/',
			//noaaNGDC			= 'http://maps.ngdc.noaa.gov/arcgis/rest/services/web_mercator/dem_hillshades_mosaic/MapServer/',
			mmc					= marineCadastre + 'NationalViewer/MapServer/',
			noaaPhysOcean		= marineCadastre + 'PhysicalOceanographicAndMarineHabitat/MapServer/',
			noaaCoral			= marineCadastre + 'DeepSeaCorals/MapServer/',
			aisAll 				= marineCadastre + '2011VesselDensity/MapServer/',
			aisCargo 			= marineCadastre + '2011CargoVesselDensity/MapServer/',
			aisPassenger 		= marineCadastre + '2011PassengerVesselDensity/MapServer/',
			aisTugTow 			= marineCadastre + '2011TugTowingVesselDensity/MapServer/',
			aisTanker 			= marineCadastre + '2011TankerVesselDensity/MapServer/',
			watersGeo_303d		= 'http://watersgeo.epa.gov/arcgis/rest/services/OWRAD_NP21/303D_NP21/MapServer/',
			watersGeo_tmdl		= 'http://watersgeo.epa.gov/arcgis/rest/services/OWRAD_NP21/TMDL_NP21/MapServer/',
			epaBeaches			= 'http://watersgeo.epa.gov/arcgis/rest/services/OWPROGRAM/BEACON_NAD83/MapServer/',
			nps					= 'http://mapservices.nps.gov/arcgis/rest/services/LandResourcesDivisionTractAndBoundaryService/MapServer/',
			pcs					= 'http://geodata.epa.gov/arcgis/rest/services/OEI/FRS_INTERESTS/MapServer/',
			hucs				= 'http://50.19.218.171/arcgis1/rest/services/HydrologicUnitCodes/MapServer/',
			tncChlorophyll		= 'http://50.18.215.52/arcgis/rest/services/NAMERA/EUSD_NAM_ocean/MapServer/',
			metadataURL 		= "http://www.northeastoceandata.org/files/metadata/";
		configOptions = {
			themes: [
				{
					title: "Maritime Commerce",
					maps: [
						{
							title: "Navigation",
							group: 'navigation',
							menuWidth: 291,
							flexLink: 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,26,27,28,29,30,31,32,33;admin=9999;HereIsMyMap#',
							about: {
								overview: "This map shows boundaries and designations that define the basic marine transportation system for commercial and recreational vessels in the region.",
								dataConsiderations: "Most of the features on the map are officially designated and actively maintained by the U.S. Coast Guard or the U.S. Navy, and their locations are well established. Examples include Anchorages; Maintained Channels; Safety, Security, and Regulated Zones; Danger Zone and Restricted Areas; and WhalesNorth Mandatory Ship Reporting System.<br /><br />Some of the Pilot Boarding Areas on the map are not designated by federal or state government authorities. However, they are well known and considered important by the maritime commerce sector.",
								status: "We are working with the U.S. Coast Guard, Bureau of Ocean Energy Management, National Oceanic and Atmospheric Administration, and the maritime commerce community to verify and enhance the datasets, such as by identifying additional areas that are important for marine operations."
							},
							scaleRestriction: {
								minLevel : 12,
								text : 'Aids to Navigation'
							},
							layers: {
								dynamicLayers: [
									{
										URL : oceanUses,
										layers: [
											{
												name: "Maintained Channels",
												metadata	: metadataURL + "OceanUses/MaintainedChannels.pdf",
												outField: "location"
											},
											{
												name: "Danger Zone and Restricted Areas",
												metadata	: metadataURL + "OceanUses/DangerZoneAndRestrictedAreas.pdf",
												outField: "description"
											},
											{
												name: "Safety, Security, and Regulated Zones",
												metadata	: metadataURL + "OceanUses/SafetySecurityRegulatedAreas.pdf",
												outField: "designation"
											},
											{
												name: "WhalesNorth Mandatory Ship Reporting System",
												metadata	: metadataURL + "OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf"
											},
											{
												name: "Marine Mammal Seasonal Management Areas",
												metadata	: metadataURL + "OceanUses/MarineMammalSeasonalAreas.pdf"
											},
											{
												name: "Marine Transportation",
												metadata	: metadataURL + "OceanUses/MarineTransportation.pdf",
												outField: "description"
											},
											{
												name: "Pilot Boarding Areas",
												metadata	: metadataURL + "OceanUses/PilotBoardingAreas.pdf",
												outField: "boardingArea"
											},
											{
												name: "Anchorages",
												metadata	: metadataURL + "OceanUses/Anchorages.pdf",
												outField: "description"
											},
											{
												name: "Aids to Navigation",
												metadata	: metadataURL + "OceanUses/AidsToNavigation.pdf",
												outField: "aidName"
											}
										]
									}
								]
							}
						},
						{
							title: "Potential Hazards",
							group: 'hazards',
							menuWidth: 271,
							flexLink: 'http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,13,14,15,19,24,25;admin=9999;HereIsMyMap#',
							about: {
								overview: "This map shows the locations of some potential hazards on the seabed, including unexploded ordnance, disposal sites, cables, and pipelines.",
								dataConsiderations: "This map can be used to help identify areas of risk to human health and property. People should take caution with the use of these data and recognize that the original sources are known to be incomplete.",
								status: "We are actively working with the telecommunications industry to improve the submarine cable layer. We are not planning updates to the other datasets at this time."
							},
							scaleRestriction: {
								minLevel : 10,
								text : 'Submarine Cable and Pipeline Areas'
							},
							layers: {
								dynamicLayers: [
									{
										URL: oceanUses,
										layers: [
											{
												name: "Unexploded Ordnance Locations",
												metadata	: metadataURL + "OceanUses/UnexplodedOrdnanceLocations.pdf",
												outField: "description"
											},
											{
												name: "Unexploded Ordnance Areas",
												metadata	: metadataURL + "OceanUses/UnexplodedOrdnanceAreas.pdf",
												outField: "description"
											},
											{
												name: "Ocean Disposal Sites",
												metadata	: metadataURL + "OceanUses/OceanDisposalSites.pdf",
												outField: "description"
											},
											{
												name: "Submarine Cables",
												metadata	: metadataURL + "OceanUses/SubmarineCables"
											},
											{
												name: "Submarine Cable Areas",
												metadata	: metadataURL + "OceanUses/CableAreas"
											},
											{
												name: "Submarine Pipeline Areas",
												metadata	: metadataURL + "OceanUses/PipelineAreas"
											}
										]
									}
								]
							}
						},
						{
							title: "Commercial Traffic",
							group: 'traffic',
							menuWidth: 229,
							hasRadioBtns : true,
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
												metadata	: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2011.pdf",
												checked: true,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,34;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Cargo AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,35;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Passenger AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,36;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tug-Tow AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,37;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tanker AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,38;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 All AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,39;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Cargo AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,40;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Passenger AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,41;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tug-Tow AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,42;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tanker AIS Vessel Density",
												metadata	: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,43;admin=9999;HereIsMyMap#"
											}
										]
									}
								]
							}
						}
					]
				},
				// {
				// 	title: "AIS TimeSlider",
				// 	maps: [
				// 	{
				// 			title: "2012 Monthly AIS Tug-Tow",
				// 			about: {
				// 				overview: "This map shows AIS Data.",
				// 				dataConsiderations: "Data from NOAA.",
				// 				status: "This is a demo layer."
				// 			},
				// 			layers: {
				// 				dynamicLayers: [
				// 					{
				// 						URL : "http://gis.asascience.com/arcgis/rest/services/RegionalPortal/MonthlyAIS/MapServer/",
				// 						layers: [
				// 							{
				// 								name: "MonthlyTugTow_Stdev",
				// 								showtimeSlider:true,
				// 								metadata	: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							}
				// 							// ,
				// 							// {
				// 							// 	name: "Legend",
				// 							// 	metadata	: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							// }
				// 						]
				// 					}
				// 				]
				// 			}
				// 		},
				// 		{
				// 			title: "2012 Monthly AIS Cargo",
				// 			about: {
				// 				overview: "This map shows AIS Data.",
				// 				dataConsiderations: "Data from NOAA.",
				// 				status: "This is a demo layer."
				// 			},
				// 			layers: {
				// 				dynamicLayers: [
				// 					{
				// 						URL : "http://gis.asascience.com/arcgis/rest/services/RegionalPortal/MonthlyAIS/MapServer/",
				// 						layers: [
				// 							{
				// 								name: "MonthlyCargo_Stdev",
				// 								showtimeSlider:true,
				// 								metadata	: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							}
				// 							// ,
				// 							// {
				// 							// 	name: "Legend",
				// 							// 	metadata	: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							// }
				// 						]
				// 					}
				// 				]
				// 			}
				// 		}]
				// },
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
				},
				{
					title: "Culture",
					maps: []
				},
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
				},
				{
					title: "Restoration",
					maps: []
				},
				{
					title: "Data Viewer",
					maps: []
				}
			],
			comp_viewer: {
				groups: [
					{
						title: 'Commerce',
						searchOnTitle : true,
						serviceURLs: [
							maritimeCommerce,
							mmc,
							aisAll,
							aisCargo,
							aisPassenger,
							aisTugTow,
							aisTanker
						],
						layers: [
							{
								name		: 	'Wrecks and Obstructions',
								metadata	:	metadataURL + 'OceanUses/WrecksandObstructions',
								serviceURL	:	maritimeCommerce,
								subGroup	:	'Navigation'
							},
							{
								name		: 	'Aids to Navigation',
								metadata	:	'http://coast.noaa.gov/htdata/CMSP/Metadata/AidstoNavigation.htm',
								serviceURL	:	mmc,
								external	:	'ftp://ftp.coast.noaa.gov/pub/MSP/AidsToNavigation.zip'
							},
							{
								name		: 	'Pilot Boarding Areas',
								metadata	:	metadataURL + 'OceanUses/PilotBoardingAreas.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		: 	'Anchorages',
								metadata	:	metadataURL + 'OceanUses/Anchorages.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		: 	'Maintained Channels',
								metadata	:	metadataURL + 'OceanUses/MaintainedChannels.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		: 	'Marine Transportation',
								metadata	:	metadataURL + 'OceanUses/MarineTransportation.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		: 	'Danger Zones and Restricted Areas',
								metadata	:	'http://coast.noaa.gov/htdata/CMSP/Metadata/DangerZonesAndRestrictedAreas.htm',
								serviceURL	:	mmc,
								subGroup	:	'Potential Hazards'
							},
							{
								name		:	'Safety, Security, and Regulated Zones',
								metadata	:	metadataURL + 'OceanUses/SafetySecurityRegulatedAreas.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'WhalesNorth Mandatory Ship Reporting System',
								metadata	:	metadataURL + 'OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'Marine Mammal Seasonal Management Areas',
								metadata	:	metadataURL + 'OceanUses/MarineMammalSeasonalAreas.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'Unexploded Ordnances',
								metadata	:	'http://coast.noaa.gov/htdata/CMSP/Metadata/UnexplodedOrdnances.htm',
								serviceURL	:	mmc
							},
							{
								name		:	'Ocean Disposal Sites',
								metadata	:	metadataURL + 'OceanUses/OceanDisposalSites.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'Submarine Cables',
								metadata	:	metadataURL + 'OceanUses/SubmarineCables',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'Submarine Cable Areas',
								metadata	:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'Submarine Pipeline Areas',
								metadata	:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'2011 Vessel Density',
								metadata	:	'',
								serviceURL	:	aisAll,
								tile		:	true,
								subGroup	:	'Commercial Traffic'
							},
							{
								name		:	'2011 Cargo Vessel Density',
								metadata	:	'',
								serviceURL	:	aisCargo,
								tile		:	true
							},
							{
								name		:	'2011 Passenger Vessel Density',
								metadata	:	'',
								serviceURL	:	aisPassenger,
								tile		:	true
							},
							{
								name		:	'2011 Tug and Towing Vessel Density',
								metadata	:	'',
								serviceURL	:	aisTugTow,
								tile		:	true
							},
							{
								name		:	'2011 Tanker Vessel Density',
								metadata	:	'',
								serviceURL	:	aisTanker,
								tile		:	true
							},
							{
								name		:	'2012 All AIS Vessel Density',
								metadata	:	metadataURL + 'AIS/NorthAtlanticTotalAISVesselDensity2012.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'2012 Cargo AIS Vessel Density',
								metadata	:	metadataURL + 'AIS/NorthAtlanticCargoAISVesselDensity2012.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'2012 Passenger AIS Vessel Density',
								metadata	:	metadataURL + 'AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'2012 Tug-Tow AIS Vessel Density',
								metadata	:	metadataURL + 'AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		:	'2012 Tanker AIS Vessel Density',
								metadata	:	metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf',
								serviceURL	:	maritimeCommerce
							}
						]
					},
					{
						title	: 'Energy',
						searchOnTitle : true,
						serviceURLs: [
							energy,
							mmc
						],
						layers	: [
							{
								name		: 	'Maximum Tidal Currents Speed m/s, January 2009',
								metadata	:	metadataURL + 'PhysicalOceanography/MaxTidalCurrentsSpeed.pdf',
								serviceURL	:	energy,
								subGroup	:	'Resources'
							},
							{
								name		: 	'Annual Mean Offshore Wind Speed m/s',
								metadata	:	metadataURL + 'PhysicalOceanography/OffshoreWindEnergyPotential',
								serviceURL	:	energy
							},
							{
								name		: 	'Offshore Tidal Hydrokinetic Projects',
								metadata	:	metadataURL + 'OceanUses/OffshoreTidalHydrokineticProjects',
								serviceURL	:	energy,
								subGroup	:	'Planning Areas'
							},
							{
								name		: 	'UMaine Wind Turbine Test Project',
								metadata	:	metadataURL + 'OceanUses/UMaineTestDemonstrationProject.pdf',
								serviceURL	:	energy
							},
							{
								name		: 	'Block Island Proposed Turbine Locations',
								metadata	:	metadataURL + 'OceanUses/BlockIslandProposedTurbineLocations.pdf',
								serviceURL	:	energy
							},
							{
								name		: 	'Block Island Transmission Cables',
								metadata	:	metadataURL + 'OceanUses/BlockIslandTransmissionCables.pdf',
								serviceURL	:	energy
							},
							{
								name		: 	'Block Island Renewable Energy Zone',
								metadata	:	metadataURL + 'OceanUses/RenewableEnergyZone',
								serviceURL	:	energy
							},
							{
								name		:	'Massachusetts Wind Energy Areas - State Designated',
								metadata	:	metadataURL + 'OceanUses/moris_om_wind_energy_areas_poly',
								serviceURL	:	energy
							},
							{
								name		:	'Ocean Energy Demonstration Sites',
								metadata	:	metadataURL + 'OceanUses/OceanEnergyDemonstrationSites.pdf',
								serviceURL	:	energy
							},
							{
								name		:	'Active Renewable Energy Leases',
								metadata	:	'http://www.boem.gov/BOEM-Lease-Areas-Metadata/',
								serviceURL	:	mmc
							},
							{
								name		:	'BOEM Wind Planning Areas',
								metadata	:	'http://metadata.boem.gov/geospatial/BOEM_Wind_Planning_Areas.xml',
								serviceURL	:	mmc
							},
							{
								name		:	'LNG Sites',
								metadata	:	metadataURL + 'OceanUses/LNGsites',
								serviceURL	:	energy,
								subGroup	:	'Infrastructure'
							},
							{
								name		:	'Coastal Energy Facilities',
								metadata	:	metadataURL + 'OceanUses/CoastalEnergyFacilities',
								serviceURL	:	energy
							},
							{
								name		:	'New England Electrical Transmission Substations',
								metadata	:	metadataURL + 'OceanUses/NewEnglandElectricalTransmissionSubstations.pdf',
								serviceURL	:	energy
							},
							{
								name		:	'New England Electrical Transmission Lines',
								metadata	:	metadataURL + 'OceanUses/NewEnglandElectricalTransmissionLines.pdf',
								serviceURL	:	energy
							},
							{
								name		:	'Submarine Cables',
								metadata	:	metadataURL + 'OceanUses/SubmarineCables',
								serviceURL	:	energy
							},
							{
								name		:	'Submarine Cable Areas',
								metadata	:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								serviceURL	:	energy
							},
							{
								name		:	'Submarine Pipeline Areas',
								metadata	:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								serviceURL	:	energy
							}
						]
					},
					{
						title	: 'Recreation & Culture',
						serviceURLs: [
							recAndCulture,
							epaBeaches,
							nps,
							mmc,
							securedLands
						],
						layers	: [
							{
								name		: 	'Wrecks and Obstructions',
								metadata	:	metadataURL + 'OceanUses/WrecksandObstructions',
								serviceURL	: 	recAndCulture,
								subGroup	:	'Recreation'
							},
							{
								name		: 	'Water Trails',
								metadata	: 	metadataURL + 'OceanUses/WaterTrails.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'Boat Launches',
								metadata	: 	metadataURL + 'OceanUses/BoatLaunches.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'National Marine Sanctuary',
								metadata	: 	metadataURL + 'Administrative/NationalMarineSanctuary',
								serviceURL	: 	recAndCulture
							},
							{
								name		:	'Beaches_Line_View',
								label		:	'Beaches',
								metadata	: 	'https://edg.epa.gov/metadata/rest/document?id={4A2F897E-E1E4-453E-9A29-674A520E4B92}&xsl=metadata_to_html_full',
								serviceURL	: 	epaBeaches
							},
							{
								name		:	'National Park Service Boundaries',
								label		:	'National Parks',
								metadata	:	'https://irma.nps.gov/App/Reference/Profile/2218503',
								serviceURL	:	nps
							},
							{
								name		:	'Coastal Tribal Lands',
								metadata	:	'http://coast.noaa.gov/htdata/CMSP/Metadata/CoastalTribalLands.htm',
								serviceURL	:	mmc
							},
							{
								name		: 	'Recreational Boater Activities',
								metadata	: 	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		:	'Recreational Diving',
								metadata	:	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	:	recAndCulture
							},
							{
								name		:	'Recreational Fishing',
								metadata	:	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	:	recAndCulture
							},
							{
								name		:	'Recreational Relaxing',
								metadata	:	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	:	recAndCulture
							},
							{
								name		:	'Recreational Swimming',
								metadata	:	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	:	recAndCulture
							},
							{
								name		:	'Recreational Wildlife Viewing',
								metadata	:	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	:	recAndCulture
							},
							{
								name		: 	'Recreational Target Fish Species',
								metadata	: 	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'Recreational Target Wildlife Viewing',
								metadata	: 	metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'Recreational Boater Routes',
								metadata	: 	metadataURL + 'OceanUses/RecreationalBoaterRoutes.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'Recreational Boating Density',
								metadata	: 	metadataURL + 'OceanUses/RecreationalBoaterRouteDensity.pdf',
								serviceURL	: 	recAndCulture
							},
							{
								name		: 	'Secured Lands',
								metadata	: 	metadataURL + 'SecuredLands/SecuredLands2012.pdf',
								serviceURL	: 	securedLands
							},
							{
								name		: 	'National Register of Historic Places: Sites and Landmarks',
								metadata	: 	metadataURL + 'OceanUses/NationalRegisterHistoricPlacesPoints.pdf',
								serviceURL	: 	recAndCulture,
								subGroup	:	'Culture'
							},
							{
								name		: 	'National Register of Historic Places: Districts and Properties',
								metadata	: 	metadataURL + 'OceanUses/NationalRegisterHistoricPlacesPolygons.pdf',
								serviceURL	: 	recAndCulture
							}
						]
					},
					{
						title: 'Commercial Fishing',
						serviceURLs: [
							monkfish,
							multispecies,
							scallop,
							quahog
						],
						layers: [
							{
								name		: 	'VMS Monkfish Fishery Density 2006-2011',
								metadata	:	metadataURL + 'CommercialFishing/VMSMultispeciesFishery2006-2010.pdf',
								serviceURL	:	monkfish,
								tile		:	true
							},
							{
								name		: 	'VMS Multispecies Fishery Density 2006-2010',
								metadata	:	metadataURL + 'CommercialFishing/VMSMonkfishFishery2006-2010.pdf',
								serviceURL	:	multispecies,
								tile		:	true
							},
							{
								name		: 	'VMS Scallop Fishery Density 2006-2010',
								metadata	:	metadataURL + 'CommercialFishing/VMSScallopFishery2006-2010.pdf',
								serviceURL	:	scallop,
								tile		:	true
							},
							{
								name		: 	'VMS Surf clam/Quahog Fishery Density 2006-2010',
								metadata	:	metadataURL + 'CommercialFishing/VMSSurfClamQuahogFishery2006-2010.pdf',
								serviceURL	:	quahog,
								tile		:	true
							}
						]
					},
					{
						title: 'Aquaculture',
						serviceURLs: [
							aquaculture,
							fedFish,
							otherMarineLife
							//,noaaNGDC
						],
						layers: [
							{
								name		: 	'Aquaculture',
								metadata	:	metadataURL + 'OceanUses/Aquaculture.pdf',
								serviceURL	:	aquaculture
							},
							{
								name		: 	'Shellfish Management Areas',
								metadata	:	metadataURL + 'OceanUses/ShellfishManagementAreas.pdf',
								serviceURL	:	aquaculture
							},
							{
								name		: 	'Environmental Degradation Closures',
								metadata	:	'http://www.greateratlantic.fisheries.noaa.gov/educational_resources/gis/data/shapefiles/Environmental_Degradation_Closures/Environmental_Degradation_Closures_METADATA.pdf',
								serviceURL	:	fedFish
							},
							{
								name		: 	'Food Safety Program Temporary PSP Closures',
								metadata	:	'http://www.greateratlantic.fisheries.noaa.gov/educational_resources/gis/data/shapefiles/Food_Safety_Program_PSP_Closures/Food_Safety_Program_Temporary_PSP_Closures_METADATA.pdf',
								serviceURL	:	fedFish
							},
							{
								name		: 	'Eelgrass Beds',
								metadata	:	metadataURL + 'Biology/EelgrassBeds.pdf',
								serviceURL	:	otherMarineLife
							},
							{
								name		: 	'Water Depth',
								metadata	:	metadataURL + 'PhysicalOceanography/Bathymetry',
								serviceURL	:	aquaculture
							},
							{
								name		: 	'Sediment Grain Size',
								metadata	:	metadataURL + 'PhysicalOceanography/SedimentGrainSize',
								serviceURL	:	aquaculture
							}
							// ,
							// {
							// 	name		:	'DEM Hillshades',
							// 	metadata	:	'http://ngdc.noaa.gov/mgg/inundation/tsunami/general.html',
							// 	label		:	'NGDC DEM Hillshades',
							// 	serviceURL	:	noaaNGDC,
							// 	tile		:	true
							// }
						]
					},
					{
						title: 'Fish and Shellfish',
						serviceURLs: [
							fishAndShellfish,
							noaaEFH,
							noaaHAPC,
							tncDemersal
						],
						layers: [
							{
								name		: 	'Shellfish Habitat',
								metadata	:	metadataURL + 'Biology/ShellfishHabitat.pdf',
								serviceURL	:	fishAndShellfish
							},
							{
								name		: 	'Essential Fish Habitat - Areas Protected from Fishing',
								label		:	'Essential Fish',
								metadata	:	'http://catalog.data.gov/harvest/object/4164cd2e-d7a8-46ef-8021-ae6fe934204f/html',
								serviceURL	:	noaaEFH
							},
							{
								name		: 	'Habitat Areas of Particular Concern (HAPC)',
								metadata	:	'http://catalog.data.gov/harvest/object/6bbaf4a3-44c1-4d3e-91c4-19f8d8608b63/html/original',
								serviceURL	:	noaaHAPC
							},
							{
								name		: 	'Highly Migratory Species EFH Overlay',
								metadata	:	metadataURL + 'Biology/HighlyMigratorySpeciesEFHOverlay.pdf',
								serviceURL	:	fishAndShellfish
							},
							{
								name		: 	'Groundfish and Shellfish EFH Overlay',
								metadata	:	'https://s3.amazonaws.com/marco-public-2d/Metadata_files/html/efh_overlay.html',
								serviceURL	:	fishAndShellfish
							},
							{
								name		: 	'Fall weighted persistence',
								label		:	'Atlantic Cod Fall, Weighted Persistence',
								metadata	:	metadataURL + 'Biology/MarineFishWeightedPersistenceFall',
								serviceURL	:	tncDemersal,
								parent		:	'Atlantic Cod'
							},
							{
								name		: 	'Spring weighted persistence',
								label		:	'Atlantic Cod Spring, Weighted Persistence',
								metadata	:	metadataURL + 'Biology/MarineFishWeightedPersistenceSpring',
								serviceURL	:	tncDemersal,
								parent		:	'Atlantic Cod'
							},
							{
								name		:	'Atlantic Herring Fall, Fish Weighted Persistence',
								metadata	:	metadataURL + 'Biology/MarineFishWeightedPersistenceFall',
								serviceURL	:	fishAndShellfish
							},
							{
								name		:	'Atlantic Herring Spring, Fish Weighted Persistence',
								metadata	:	metadataURL + 'Biology/MarineFishWeightedPersistenceSpring',
								serviceURL	:	fishAndShellfish
							},
							{
								name		:	'Atlantic Herring Abundance',
								metadata	:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	:	fishAndShellfish
							}
							,
							{
								name		:	'Atlantic Mackerel Abundance',
								metadata	:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	:	fishAndShellfish
							}
							,
							{
								name		:	'Sand Lance Abundance',
								metadata	:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	:	fishAndShellfish
							}
							,
							{
								name		:	'Species Richness',
								metadata	:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	:	fishAndShellfish
							}
							,
							{
								name		:	'Total Biomass kg',
								metadata	:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	:	fishAndShellfish
							}
						]
					},
					{
						title	: 'Marine Mammals & Sea Turtles',
						serviceURLs: [
							marineMammals
						],
						layers	: [
							{
								name		: 	'Marine Mammals Habitat',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals,
								subGroup	:	'Marine Mammals'
							},
							{
								name		: 	'Fin Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Fin Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Fin Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Fin Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Humpback Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Humpback Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Humpback Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Humpback Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Minke  Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Minke Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Minke Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Minke Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'North Atlantic Right Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'North Atlantic Right Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'North Atlantic Right Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'North Atlantic Right Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sei Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sei Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sei Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sei Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sperm Whale Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sperm Whale Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sperm Whale Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Sperm Whale Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Harbor Porpoise Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Harbor Porpoise Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Harbor Porpoise Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Harbor Porpoise Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Bottlenose Dolphin Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Bottlenose Dolphin Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Bottlenose Dolphin Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Bottlenose Dolphin Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Atlantic White-sided Dolphin Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Atlantic White-sided Dolphin Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Atlantic White-sided Dolphin Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Atlantic White-sided Dolphin Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Striped Dolphin Winter, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Striped Dolphin Spring, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Striped Dolphin Summer, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Striped Dolphin Fall, SPUE',
								metadata	:	metadataURL + 'Biology/MarineMammals',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Leatherback Sea Turtle Winter, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf',
								serviceURL	:	marineMammals,
								subGroup	:	'Sea Turtles'
							},
							{
								name		: 	'Leatherback Sea Turtle Spring, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Leatherback Sea Turtle Summer, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Leatherback Sea Turtle Fall, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Loggerhead Sea Turtle Winter, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Loggerhead Sea Turtle Spring, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Loggerhead Sea Turtle Summer, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Loggerhead Sea Turtle Fall, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Green Sea Turtle Winter, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Green Sea Turtle Spring, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Green Sea Turtle Summer, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf',
								serviceURL	:	marineMammals
							},
							{
								name		: 	'Green Sea Turtle Fall, SPUE',
								metadata	:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf',
								serviceURL	:	marineMammals
							}
						]
					}
					,
					{
						title	: 'Other Marine Life',
						serviceURLs: [
							otherMarineLife,
							noaaPhysOcean,
							noaaCoral,
							tncChlorophyll
						],
						layers	: [
							{
								name		: 	'Artificial Reefs',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/ArtificialReefs.htm',
								serviceURL	: 	noaaPhysOcean,
								subGroup	:	'Habitat'
							},
							{
								name		: 	'Critical Habitat Designations',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/CriticalHabitatDesignations.htm',
								serviceURL	: 	noaaPhysOcean
							},
							{
								name		: 	'Eelgrass Beds',
								metadata	: 	metadataURL + 'Biology/EelgrassBeds.pdf',
								serviceURL	:	otherMarineLife
							},
							{
								name		: 	'Coastal Wetlands',
								metadata	: 	metadataURL + 'Biology/CoastalWetlands.pdf',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Seafloor Habitats',
								metadata	: 	metadataURL + 'Biology/TNCBenthicHabitatModel',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Alcyonacea',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/Alcyonacea.htm',
								serviceURL	: 	noaaCoral,
								subGroup	:	'Corals'
							},
							{
								name		: 	'Gorgonian Alcyonacea',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/GorgonianAlcyonacea.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Non-Gorgonian Alcyonacea',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/NonGorgonianAlcyonacea.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Pennatulacea',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/Pennatulacea.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Pennatulacea Sessiliflorae',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/PennatulaceaSessiliflorae.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Pennatulacea Subsessiliflorae',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/PennatulaceaSubsessiliflorae.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Scleractinia Caryophylliidae',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/ScleractiniaCaryophylliidae.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Scleractinia Flabellidae',
								metadata	: 	'http://coast.noaa.gov/htdata/CMSP/Metadata/ScleractiniaFlabellidae.htm',
								serviceURL	: 	noaaCoral
							},
							{
								name		: 	'Primary Production',
								metadata	: 	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	: 	otherMarineLife,
								subGroup	:	'Plankton'
							},
							{
								name		: 	'Calanus Finmarchicus, Fall',
								metadata	: 	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Euphausiids, Fall',
								metadata	: 	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Gammarid Amphipods, Fall',
								metadata	: 	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Mysid Shrimp, Fall',
								metadata	: 	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								serviceURL	: 	otherMarineLife
							},
							{
								name		: 	'Winter',
								label		: 	'Chlorophyll A Winter',
								metadata	: 	metadataURL + 'Biology/ChlorophyllAfall.pdf',
								serviceURL	: 	tncChlorophyll,
								parent		:	'Chloropyll a'
							},
							{
								name		: 	'Spring',
								label		: 	'Chlorophyll A Spring',
								metadata	: 	metadataURL + 'Biology/ChlorophyllAspring.pdf',
								serviceURL	: 	tncChlorophyll,
								parent		:	'Chloropyll a'
							},
							{
								name		: 	'Summer',
								label		: 	'Chlorophyll A Summer',
								metadata	: 	metadataURL + 'Biology/ChlorophyllAsummer.pdf',
								serviceURL	: 	tncChlorophyll,
								parent		:	'Chloropyll a'
							},
							{
								name		: 	'Fall',
								label		: 	'Chlorophyll A Fall',
								metadata	: 	metadataURL + 'Biology/ChlorophyllAfall.pdf',
								serviceURL	: 	tncChlorophyll,
								parent		:	'Chloropyll a'
							}
						]
					},
					{
						title: 'Water Quality',
						serviceURLs: [
							maritimeCommerce,
							watersGeo_303d,
							watersGeo_tmdl,
							pcs,
							hucs
						],
						layers: [
							{
								name		: 	'No Discharge Zones',
								metadata	:	metadataURL + 'OceanUses/NoDischargeZones.pdf',
								serviceURL	:	maritimeCommerce
							},
							{
								name		: 	'Impaired Waters Line',
								label		:	'Impaired Rivers or Coastline',
								metadata	:	'https://edg.epa.gov/metadata/rest/document?id={66F27299-6B1B-42BF-8AA0-1127D7646631}&xsl=metadata_to_html_full',
								serviceURL	:	watersGeo_303d
							},
							{
								name		: 	'Impaired Waters Area',
								label		:	'Impaired Water Bodies',
								metadata	:	'https://edg.epa.gov/metadata/rest/document?id={66F27299-6B1B-42BF-8AA0-1127D7646631}&xsl=metadata_to_html_full',
								serviceURL	:	watersGeo_303d
							},
							{
								name		: 	'Total Max Daily Loads Line',
								label		:	'TMDL Rivers or Coastline',
								metadata	:	'https://edg.epa.gov/metadata/rest/document?id={88E53742-CF0D-443C-94AF-8139C09471F9}&xsl=metadata_to_html_full',
								serviceURL	:	watersGeo_tmdl
							},
							{
								name		: 	'Total Max Daily Loads Area',
								label		:	'TMDL Water Bodies',
								metadata	:	'https://edg.epa.gov/metadata/rest/document?id={88E53742-CF0D-443C-94AF-8139C09471F9}&xsl=metadata_to_html_full',
								serviceURL	:	watersGeo_tmdl
							},
							{
								name		: 	'PCS_NPDES',
								label		:	'Wastewater Discharges',
								metadata	:	'https://edg.epa.gov/metadata/rest/document?id={6C7CBE2A-6547-4211-A328-6759D11DC117}&xsl=metadata_to_html_full',
								serviceURL	:	pcs
							},
							{
								name		: 	'6-digit HUC',
								metadata	:	metadataURL + 'PhysicalOceanography/WBDHU6.htm',
								serviceURL	:	hucs
							},
							{
								name		: 	'8-digit HUC',
								metadata	:	metadataURL + 'PhysicalOceanography/WBDHU8.htm',
								serviceURL	:	hucs
							},
							{
								name		: 	'10-digit HUC',
								metadata	:	metadataURL + 'PhysicalOceanography/WBDHU10.htm',
								serviceURL	:	hucs
							},
							{
								name		: 	'12-digit HUC',
								metadata	:	metadataURL + 'PhysicalOceanography/WBDHU12.htm',
								serviceURL	:	hucs
							}
						]
					},
					{
						title	: 'Administrative',
						serviceURLs: [
							administrative
						],
						layers	: [
							{
								name		: 'Marine Jurisdictions',
								metadata	: metadataURL + 'Administrative/MarineJurisdictions.htm',
								serviceURL	: administrative
							},
							{
								name		: 'Coastal Barrier Resource System',
								metadata	: metadataURL + 'Administrative/CoastalBarrierResourceSystem.htm',
								serviceURL	: administrative
							},
							{
								name		: 'National Marine Sanctuary',
								metadata	: metadataURL + 'Administrative/NationalMarineSanctuary.htm',
								serviceURL	: administrative
							},
							{
								name		: 'Outer Continental Lease Blocks',
								metadata	: metadataURL + 'Administrative/OuterContinentalShelfLeaseBlocks.htm',
								serviceURL	: administrative,
								external	: 'http://www.boem.gov/Oil-and-Gas-Energy-Program/Mapping-and-Data/ATL_BLKCLIP(3).aspx'
							},
							{
								name		: 'Counties',
								metadata	: metadataURL + 'Administrative/CountyBoundaries.htm',
								serviceURL	: administrative,
								noSource	: true
							},
							{
								name		: 'States',
								metadata	: metadataURL + 'Administrative/States.htm',
								serviceURL	: administrative
							}
						]
					}
				]
			}
		}
	}
);