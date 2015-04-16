define([],
	function ()
	{
		var serviceURL 			= "http://50.19.218.171/arcgis1/rest/services/",
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
			noaaEFH				= 'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/NMFS/EFHAreasProtectedFromFishing/MapServer/',
			noaaHAPC			= 'http://egisws02.nos.noaa.gov/ArcGIS/rest/services/NMFS/HAPC/MapServer/',
			tncDemersal			= 'http://50.18.215.52/arcgis/rest/services/NAMERA/EUSD_NAM_DEMERSAL/MapServer/',
			//noaaNGDC			= 'http://maps.ngdc.noaa.gov/arcgis/rest/services/web_mercator/dem_hillshades_mosaic/MapServer/',
			mmc					= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/NationalViewer/MapServer/',
			aisAll 				= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/2011VesselDensity/MapServer/',
			aisCargo 			= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/2011CargoVesselDensity/MapServer/',
			aisPassenger 		= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/2011PassengerVesselDensity/MapServer/',
			aisTugTow 			= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/2011TugTowingVesselDensity/MapServer/',
			aisTanker 			= 'http://coast.noaa.gov/arcgis/rest/services/MarineCadastre/2011TankerVesselDensity/MapServer/',
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
												metadata: metadataURL + "OceanUses/MaintainedChannels.pdf",
												outField: "location"
											},
											{
												name: "Danger Zone and Restricted Areas",
												metadata: metadataURL + "OceanUses/DangerZoneAndRestrictedAreas.pdf",
												outField: "description"
											},
											{
												name: "Safety, Security, and Regulated Zones",
												metadata: metadataURL + "OceanUses/SafetySecurityRegulatedAreas.pdf",
												outField: "designation"
											},
											{
												name: "WhalesNorth Mandatory Ship Reporting System",
												metadata: metadataURL + "OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf"
											},
											{
												name: "Marine Mammal Seasonal Management Areas",
												metadata: metadataURL + "OceanUses/MarineMammalSeasonalAreas.pdf"
											},
											{
												name: "Marine Transportation",
												metadata: metadataURL + "OceanUses/MarineTransportation.pdf",
												outField: "description"
											},
											{
												name: "Pilot Boarding Areas",
												metadata: metadataURL + "OceanUses/PilotBoardingAreas.pdf",
												outField: "boardingArea"
											},
											{
												name: "Anchorages",
												metadata: metadataURL + "OceanUses/Anchorages.pdf",
												outField: "description"
											},
											{
												name: "Aids to Navigation",
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
												metadata: metadataURL + "OceanUses/UnexplodedOrdnanceLocations.pdf",
												outField: "description"
											},
											{
												name: "Unexploded Ordnance Areas",
												metadata: metadataURL + "OceanUses/UnexplodedOrdnanceAreas.pdf",
												outField: "description"
											},
											{
												name: "Ocean Disposal Sites",
												metadata: metadataURL + "OceanUses/OceanDisposalSites.pdf",
												outField: "description"
											},
											{
												name: "Submarine Cables",
												metadata: metadataURL + "OceanUses/SubmarineCables"
											},
											{
												name: "Submarine Cable Areas",
												metadata: metadataURL + "OceanUses/CableAreas"
											},
											{
												name: "Submarine Pipeline Areas",
												metadata: metadataURL + "OceanUses/PipelineAreas"
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
												metadata: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2011.pdf",
												checked: true,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,34;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Cargo AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,35;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Passenger AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,36;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tug-Tow AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,37;admin=9999;HereIsMyMap#"
											},
											{
												name: "2011 Tanker AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2011.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,38;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 All AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticTotalAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,39;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Cargo AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticCargoAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,40;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Passenger AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,41;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tug-Tow AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf",
												checked: false,
												flexLink: "http://northeastoceanviewer.org/?XY=-71.71000000080706;42.06&level=2&basemap=Ocean&layers=ocean=9999,42;admin=9999;HereIsMyMap#"
											},
											{
												name: "2012 Tanker AIS Vessel Density",
												metadata: metadataURL + "AIS/NorthAtlanticTankerAISVesselDensity2012.pdf",
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
				// 								metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							}
				// 							// ,
				// 							// {
				// 							// 	name: "Legend",
				// 							// 	metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
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
				// 								metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
				// 							}
				// 							// ,
				// 							// {
				// 							// 	name: "Legend",
				// 							// 	metadata: metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf'
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
				}
				,{
					title: "Data Viewer",
					maps: []
				}
			],
			comp_viewer: {
				fullServices: [
					{
						title	: 'Administrative',
						index	: 8,
						layers	: [
							{
								name			: 'Marine Jurisdictions',
								metadata		: metadataURL + 'Administrative/MarineJurisdictions.htm'
							},
							{
								name			: 'Coastal Barrier Resource System',
								metadata		: metadataURL + 'Administrative/CoastalBarrierResourceSystem.htm'
							},
							{
								name			: 'National Marine Sanctuary',
								metadata		: metadataURL + 'Administrative/NationalMarineSanctuary.htm'
							},
							{
								name			: 'Outer Continental Lease Blocks',
								metadata		: metadataURL + 'Administrative/OuterContinentalShelfLeaseBlocks.htm',
								external		: 'http://www.boem.gov/Oil-and-Gas-Energy-Program/Mapping-and-Data/ATL_BLKCLIP(3).aspx'
							},
							{
								name			: 'Counties',
								metadata		: metadataURL + 'Administrative/CountyBoundaries.htm',
								noSource		: true
							},
							{
								name			: 'States',
								metadata		: metadataURL + 'Administrative/States.htm'
							}
						]
					},
					{
						title	: 'Energy',
						index	: 1,
						layers	: [
							{
								name			: 	'Maximum Tidal Currents Speed m/s, January 2009',
								metadata		:	metadataURL + 'PhysicalOceanography/MaxTidalCurrentsSpeed.pdf'
							},
							{
								name			: 	'Annual Mean Offshore Wind Speed m/s ',
								metadata		:	metadataURL + 'PhysicalOceanography/OffshoreWindEnergyPotential'
							},
							{
								name			: 	'Offshore Tidal Hydrokinetic Projects',
								metadata		:	metadataURL + 'OceanUses/OffshoreTidalHydrokineticProjects'
							},
							{
								name			: 	'UMaine Wind Turbine Test Project',
								metadata		:	metadataURL + 'OceanUses/UMaineTestDemonstrationProject.pdf'
							},
							{
								name			: 	'Block Island Proposed Turbine Locations',
								metadata		:	metadataURL + 'OceanUses/BlockIslandProposedTurbineLocations.pdf'
							},
							{
								name			: 	'Block Island Transmission Cables',
								metadata		:	metadataURL + 'OceanUses/BlockIslandTransmissionCables.pdf'
							},
							{
								name			: 	'Block Island Renewable Energy Zone',
								metadata		:	metadataURL + 'OceanUses/RenewableEnergyZone'
							},
							{
								name			:	'Massachusetts Wind Energy Areas - State Designated',
								metadata		:	metadataURL + 'OceanUses/moris_om_wind_energy_areas_poly'
							},
							{
								name			:	'Ocean Energy Demonstration Sites',
								metadata		:	metadataURL + 'OceanUses/OceanEnergyDemonstrationSites.pdf'
							},
							{
								name			:	'Active Renewable Energy Lease Areas',
								metadata		:	metadataURL + 'OceanUses/BOEMLeaseAreas09182013'
							},
							{
								name			:	'BOEM Wind Planning Areas',
								metadata		:	metadataURL + 'OceanUses/BOEMWindPlanningAreas09182013'
							},
							{
								name			:	'LNG Sites',
								metadata		:	metadataURL + 'OceanUses/LNGsites'
							},
							{
								name			:	'Coastal Energy Facilities',
								metadata		:	metadataURL + 'OceanUses/CoastalEnergyFacilities'
							},
							{
								name			:	'New England Electrical Transmission Substations',
								metadata		:	metadataURL + 'OceanUses/NewEnglandElectricalTransmissionSubstations.pdf'
							},
							{
								name			:	'New England Electrical Transmission Lines',
								metadata		:	metadataURL + 'OceanUses/NewEnglandElectricalTransmissionLines.pdf'
							},
							{
								name			:	'Submarine Cables',
								metadata		:	metadataURL + 'OceanUses/SubmarineCables'
							},
							{
								name			:	'Submarine Cable Areas',
								metadata		:	metadataURL + 'OceanUses/CableAndPipelineAreas'
							},
							{
								name			:	'Submarine Pipeline Areas',
								metadata		:	metadataURL + 'OceanUses/CableAndPipelineAreas'
							}
						]
					},
					{
						title	: 'Marine Mammals & Sea Turtles',
						index	: 6,
						layers	: [
							{
								name			: 	'Marine Mammals Habitat',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Fin Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Fin Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Fin Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Fin Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Humpback Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Humpback Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Humpback Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Humpback Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Minke Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Minke Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Minke Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Minke Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'North Atlantic Right Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'North Atlantic Right Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'North Atlantic Right Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'North Atlantic Right Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sei Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sei Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sei Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sei Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sperm Whale Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sperm Whale Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sperm Whale Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Sperm Whale Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Harbor Porpoise Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Harbor Porpoise Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Harbor Porpoise Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Harbor Porpoise Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Bottlenose Dolphin Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Bottlenose Dolphin Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Bottlenose Dolphin Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Bottlenose Dolphin Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Atlantic White-sided Dolphin Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Atlantic White-sided Dolphin Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Atlantic White-sided Dolphin Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Atlantic White-sided Dolphin Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Striped Dolphin Winter, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Striped Dolphin Spring, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Striped Dolphin Summer, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Striped Dolphin Fall, SPUE',
								metadata		:	metadataURL + 'Biology/MarineMammals'
							},
							{
								name			: 	'Leatherback Sea Turtle Winter, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf'
							},
							{
								name			: 	'Leatherback Sea Turtle Spring, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf'
							},
							{
								name			: 	'Leatherback Sea Turtle Summer, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf'
							},
							{
								name			: 	'Leatherback Sea Turtle Fall, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf'
							},
							{
								name			: 	'Loggerhead Sea Turtle Winter, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf'
							},
							{
								name			: 	'Loggerhead Sea Turtle Spring, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf'
							},
							{
								name			: 	'Loggerhead Sea Turtle Summer, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf'
							},
							{
								name			: 	'Loggerhead Sea Turtle Fall, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf'
							},
							{
								name			: 	'Green Sea Turtle Winter, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEwinter.pdf'
							},
							{
								name			: 	'Green Sea Turtle Spring, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESpring.pdf'
							},
							{
								name			: 	'Green Sea Turtle Summer, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUESummer.pdf'
							},
							{
								name			: 	'Green Sea Turtle Fall, SPUE',
								metadata		:	metadataURL + 'Biology/SeaTurtleSPUEFall.pdf'
							},
						]
					},
					{
						title	: 'Other Marine Life',
						index	: 7,
						layers	: [
							{
								name			: 'Eelgrass Beds',
								metadata		: metadataURL + 'Biology/EelgrassBeds.pdf'
							},
							{
								name			: 'Coastal Wetlands',
								metadata		: metadataURL + 'Biology/CoastalWetlands.pdf'
							},
							{
								name			: 'Primary Production',
								metadata		: metadataURL + 'Biology/NEFSC_spatial_metadata.pdf'
							},
							{
								name			: 'Calanus Finmarchicus Fall',
								metadata		: metadataURL + 'Biology/NEFSC_spatial_metadata.pdf'
							},
							{
								name			: 'Euphausiids Fall',
								metadata		: metadataURL + 'Biology/NEFSC_spatial_metadata.pdf'
							},
							{
								name			: 'Gammarid Amphipods Fall',
								metadata		: metadataURL + 'Biology/NEFSC_spatial_metadata.pdf'
							},
							{
								name			: 'Mysid Shrimp Fall',
								metadata		: metadataURL + 'Biology/NEFSC_spatial_metadata.pdf'
							},
							{
								name			: 'Seafloor Habitats',
								metadata		: metadataURL + 'Biology/TNCBenthicHabitatModel'
							}
						]
					},
					{
						title	: 'Recreation & Culture',
						index	: 2,
						layers	: [
							{
								name			: 'Wrecks and Obstructions',
								metadata		: metadataURL + 'OceanUses/WrecksandObstructions'
							},
							{
								name			: 'Water Trails',
								metadata		: metadataURL + 'OceanUses/WaterTrails.pdf'
							},
							{
								name			: 'Boat Launches',
								metadata		: metadataURL + 'OceanUses/BoatLaunches.pdf'
							},
							{
								name			: 'National Marine Sanctuary',
								metadata		: metadataURL + 'Administrative/NationalMarineSanctuary'
							},
							{
								name			: 'Recreational Boater Activities',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Diving',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Fishing',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Relaxing',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Swimming',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Wildlife Viewing',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Target Fish Species',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Target Wildlife Viewing',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterActivities.pdf'
							},
							{
								name			: 'Recreational Boater Routes',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterRoutes.pdf'
							},
							{
								name			: 'Recreational Boating Density',
								metadata		: metadataURL + 'OceanUses/RecreationalBoaterRouteDensity.pdf'
							},
							{
								name			: 'National Register of Historic Places: Sites and Landmarks',
								metadata		: metadataURL + 'OceanUses/NationalRegisterHistoricPlacesPoints.pdf'
							},
							{
								name			: 'National Register of Historic Places: Districts and Properties',
								metadata		: metadataURL + 'OceanUses/NationalRegisterHistoricPlacesPolygons.pdf'
							}
						]
					}
				],
				groups: [
					{
						title: 'Aquaculture',
						index: 4,
						serviceURLs: [
							aquaculture,
							fedFish,
							otherMarineLife
							//,noaaNGDC
						],
						layers: [
							{
								name	: 	'Aquaculture',
								metadata:	metadataURL + 'OceanUses/Aquaculture.pdf',
								service	:	aquaculture
							},
							{
								name	: 	'Shellfish Management Areas',
								metadata:	metadataURL + 'OceanUses/ShellfishManagementAreas.pdf',
								service	:	aquaculture
							},
							{
								name	: 	'Environmental Degradation Closures',
								metadata:	metadataURL + 'NERO/Environmental_Degradation_Closures_METADATA.pdf',
								service	:	fedFish
							},
							{
								name	: 	'Food Safety Program Temporary PSP Closures',
								metadata:	metadataURL + 'NERO/Food_Safety_Program_Temporary_PSP_Closures_METADATA.pdf',
								service	:	fedFish
							},
							{
								name	: 	'Eelgrass Beds',
								metadata:	metadataURL + 'Biology/EelgrassBeds.pdf',
								service	:	otherMarineLife
							},
							{
								name	: 	'Water Depth',
								metadata:	metadataURL + 'PhysicalOceanography/Bathymetry',
								service	:	aquaculture
							},
							{
								name	: 	'Sediment Grain Size',
								metadata:	metadataURL + 'PhysicalOceanography/SedimentGrainSize',
								service	:	aquaculture
							}
							// ,
							// {
							// 	name	:	'DEM Hillshades',
							// 	metadata:	'http://ngdc.noaa.gov/mgg/inundation/tsunami/general.html',
							// 	label	:	'NGDC DEM Hillshades',
							// 	service	:	noaaNGDC,
							// 	tile	:	true
							// }
						]
					},
					{
						index: 0,
						title: 'Maritime Commerce',
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
								name	: 	'Wrecks and Obstructions',
								metadata:	metadataURL + 'OceanUses/WrecksandObstructions',
								service	:	maritimeCommerce
							},
							{
								name	: 	'Aids to Navigation',
								metadata:	'http://coast.noaa.gov/htdata/CMSP/Metadata/AidstoNavigation.htm',
								service	:	mmc,
								external:	'ftp://ftp.coast.noaa.gov/pub/MSP/AidsToNavigation.zip'
							},
							{
								name	: 	'Pilot Boarding Areas',
								metadata:	metadataURL + 'OceanUses/PilotBoardingAreas.pdf',
								service	:	maritimeCommerce
							},
							{
								name	: 	'Anchorages',
								metadata:	metadataURL + 'OceanUses/Anchorages.pdf',
								service	:	maritimeCommerce
							},
							{
								name	: 	'Maintained Channels',
								metadata:	metadataURL + 'OceanUses/MaintainedChannels.pdf',
								service	:	maritimeCommerce
							},
							{
								name	: 	'Marine Transportation',
								metadata:	metadataURL + 'OceanUses/MarineTransportation.pdf',
								service	:	maritimeCommerce
							},
							{
								name	: 	'Danger Zones and Restricted Areas',
								metadata:	'http://coast.noaa.gov/htdata/CMSP/Metadata/DangerZonesAndRestrictedAreas.htm',
								service	:	mmc
							},
							{
								name	:	'Safety, Security, and Regulated Zones',
								metadata:	metadataURL + 'OceanUses/SafetySecurityRegulatedAreas.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'WhalesNorth Mandatory Ship Reporting System',
								metadata:	metadataURL + 'OceanUses/WhalesNorthMandatoryShipReportingSystem.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'Marine Mammal Seasonal Management Areas',
								metadata:	metadataURL + 'OceanUses/MarineMammalSeasonalAreas.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'Unexploded Ordnances',
								metadata:	'http://coast.noaa.gov/htdata/CMSP/Metadata/UnexplodedOrdnances.htm',
								service	:	mmc
							},
							{
								name	:	'Ocean Disposal Sites',
								metadata:	metadataURL + 'OceanUses/OceanDisposalSites.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'Submarine Cables',
								metadata:	metadataURL + 'OceanUses/SubmarineCables',
								service	:	maritimeCommerce
							},
							{
								name	:	'Submarine Cable Areas',
								metadata:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								service	:	maritimeCommerce
							},
							{
								name	:	'Submarine Pipeline Areas',
								metadata:	metadataURL + 'OceanUses/CableAndPipelineAreas',
								service	:	maritimeCommerce
							},
							{
								name	:	'2011 Vessel Density',
								metadata:	'',
								service	:	aisAll,
								tile	:	true
							},
							{
								name	:	'2011 Cargo Vessel Density',
								metadata:	'',
								service	:	aisCargo,
								tile	:	true
							},
							{
								name	:	'2011 Passenger Vessel Density',
								metadata:	'',
								service	:	aisPassenger,
								tile	:	true
							},
							{
								name	:	'2011 Tug and Towing Vessel Density',
								metadata:	'',
								service	:	aisTugTow,
								tile	:	true
							},
							{
								name	:	'2011 Tanker Vessel Density',
								metadata:	'',
								service	:	aisTanker,
								tile	:	true
							},
							{
								name	:	'2012 All AIS Vessel Density',
								metadata:	metadataURL + 'AIS/NorthAtlanticTotalAISVesselDensity2012.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'2012 Cargo AIS Vessel Density',
								metadata:	metadataURL + 'AIS/NorthAtlanticCargoAISVesselDensity2012.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'2012 Passenger AIS Vessel Density',
								metadata:	metadataURL + 'AIS/NorthAtlanticPassengerAISVesselDensity2012.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'2012 Tug-Tow AIS Vessel Density',
								metadata:	metadataURL + 'AIS/NorthAtlanticTugTowAISVesselDensity2012.pdf',
								service	:	maritimeCommerce
							},
							{
								name	:	'2012 Tanker AIS Vessel Density',
								metadata:	metadataURL + 'AIS/NorthAtlanticTankerAISVesselDensity2012.pdf',
								service	:	maritimeCommerce
							}
						]
					},
					{
						title: 'Fish and Shellfish',
						index: 5,
						serviceURLs: [
							fishAndShellfish,
							noaaEFH,
							noaaHAPC,
							tncDemersal
						],
						layers: [
							{
								name	: 	'Shellfish Habitat',
								metadata:	metadataURL + 'Biology/ShellfishHabitat.pdf',
								service	:	fishAndShellfish
							},
							{
								name	: 	'Essential Fish Habitat - Areas Protected from Fishing',
								label	:	'Essential Fish',
								metadata:	'http://catalog.data.gov/harvest/object/4164cd2e-d7a8-46ef-8021-ae6fe934204f/html',
								service	:	noaaEFH
							},
							{
								name	: 	'Habitat Areas of Particular Concern (HAPC)',
								metadata:	'http://catalog.data.gov/harvest/object/6bbaf4a3-44c1-4d3e-91c4-19f8d8608b63/html/original',
								service	:	noaaHAPC
							},
							{
								name	: 	'Highly Migratory Species EFH Overlay',
								metadata:	metadataURL + 'Biology/HighlyMigratorySpeciesEFHOverlay.pdf',
								service	:	fishAndShellfish
							},
							{
								name	: 	'Groundfish and Shellfish EFH Overlay',
								metadata:	'https://s3.amazonaws.com/marco-public-2d/Metadata_files/html/efh_overlay.html',
								service	:	fishAndShellfish
							},
							{
								name	: 	'Fall weighted persistence',
								label	:	'Atlantic Cod Fall, Weighted Persistence',
								metadata:	metadataURL + 'Biology/MarineFishWeightedPersistenceFall',
								label	:	'Atlantic Cod Fall, Weighted Persistence',
								service	:	tncDemersal,
								parent	:	'Atlantic Cod'
							},
							{
								name	: 	'Spring weighted persistence',
								label	:	'Atlantic Cod Spring, Weighted Persistence',
								metadata:	metadataURL + 'Biology/MarineFishWeightedPersistenceSpring',
								label	:	'Atlantic Cod Spring, Weighted Persistence',
								service	:	tncDemersal,
								parent	:	'Atlantic Cod'
							},
							{
								name	:	'Atlantic Herring Fall, Fish Weighted Persistence',
								metadata:	metadataURL + 'Biology/MarineFishWeightedPersistenceFall',
								service	:	fishAndShellfish
							},
							{
								name	:	'Atlantic Herring Spring, Fish Weighted Persistence',
								metadata:	metadataURL + 'Biology/MarineFishWeightedPersistenceSpring',
								service	:	fishAndShellfish
							},
							{
								name	:	'Atlantic Herring Abundance',
								metadata:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								service	:	fishAndShellfish
							}
							,
							{
								name	:	'Atlantic Mackerel Abundance',
								metadata:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								service	:	fishAndShellfish
							}
							,
							{
								name	:	'Sand Lance Abundance',
								metadata:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								service	:	fishAndShellfish
							}
							,
							{
								name	:	'Species Richness',
								metadata:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								service	:	fishAndShellfish
							}
							,
							{
								name	:	'Total Biomass kg',
								metadata:	metadataURL + 'Biology/NEFSC_spatial_metadata.pdf',
								service	:	fishAndShellfish
							}
						]
					},
					{
						title: 'Commercial Fishing',
						index: 3,
						serviceURLs: [
							monkfish,
							multispecies,
							scallop,
							quahog
						],
						layers: [
							{
								name	: 	'VMS Monkfish Fishery Density 2006-2011',
								metadata:	metadataURL + 'CommercialFishing/VMSMultispeciesFishery2006-2010.pdf',
								service	:	monkfish,
								tile	:	true
							},
							{
								name	: 	'VMS Multispecies Fishery Density 2006-2010',
								metadata:	metadataURL + 'CommercialFishing/VMSMonkfishFishery2006-2010.pdf',
								service	:	multispecies,
								tile	:	true
							},
							{
								name	: 	'VMS Scallop Fishery Density 2006-2010',
								metadata:	metadataURL + 'CommercialFishing/VMSScallopFishery2006-2010.pdf',
								service	:	scallop,
								tile	:	true
							},
							{
								name	: 	'VMS Surf clam/Quahog Fishery Density 2006-2010',
								metadata:	metadataURL + 'CommercialFishing/VMSSurfClamQuahogFishery2006-2010.pdf',
								service	:	quahog,
								tile	:	true
							}
						]
					}
				]
			},
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