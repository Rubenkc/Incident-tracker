import Map, { Layer, Marker, Popup , Source} from 'react-map-gl/mapbox';
import { useState, useEffect } from 'react';
import './Map.css'
import { FaLocationArrow } from 'react-icons/fa'

const {VITE_API_URL, VITE_MAP_TOKEN }= import.meta.env;


export default function MapRender(){
   let [selectedMarker, setSelectedMarker] = useState(null);
   let [neighborhoods, setNeighborhoods] = useState(null);
   let [centerLo, setCenterLo] = useState({longitude: -87.705, latitude: 41.925, zoom:15})

   async function allNeighborhoods(){
      try{
         const res = await fetch(`${VITE_API_URL}/neighborhoods`);
         const result = await res.json();

         setNeighborhoods(result.result)
      } catch (e) {
         console.log(e);
      }
   };

   function location(){
      console.log("centerLo", centerLo)
      navigator.geolocation.getCurrentPosition(
         (position) => {
            setCenterLo(prev => (
               {...prev, longitude: position.coords.longitude, latitude: position.coords.latitude}
            ))
         console.log("geo location" , position)
      })
   }

   useEffect( () => {
      allNeighborhoods()
      location()
   }, [] )

   /*let geoAreas = neighborhoods.map(n => {
      return {
         type: "Neighborhood",
         properties:{
            name: n.name
         },
         geometry: {
            type: n.type,
            coordinates: n.coords
         }
      }
   }) */

      console.log('neighborhoods', neighborhoods)

   const zone = {
      type: "FeatureCollection",
      features: neighborhoods && neighborhoods.map(n => {
      return {
         type: "Neighborhood",
         properties:{
            neighborhood: n.name
         },
         geometry: {
            type: n.type,
            coordinates: n.coords
         }
      }
   })
   }

   
   

     return (
        <div id='map'>
            <Map
               mapboxAccessToken={VITE_MAP_TOKEN}
               initialViewState={centerLo}
               mapStyle="mapbox://styles/mapbox/streets-v9"
            >
               <Source id='zone' type='geojson' data={zone}>
                  <Layer id="zone-fill" type='fill' source='zone' paint={{ "fill-color": "blue", "fill-opacity": 0.5 }}/>
                  <Layer id="zone-outline" type='line' source='zone' paint={{"line-color": "black", "line-width": 2}}/>
                  <Layer id="zone-name" type='symbol' source='zone' layout={{"text-field": ["get", "neighborhood"], "text-size": 10, "text-anchor": "center" }} />
               </Source>
               
               <Marker 
                  latitude={41.915}
                  longitude={-87.695}
               >
                  <div onClick={(e) => {
                     e.stopPropagation()
                     setSelectedMarker({longitude:-87.7143, latitude: 41.9116})}
                     }
                     className='marker'>
                     📍
                  </div>
               </Marker>

               { selectedMarker && <Popup latitude={selectedMarker.latitude} longitude={selectedMarker.longitude} 
               onClose={(e) => {
                  
                  setSelectedMarker(null)
               }
            }
               anchor='top'
               
               >
                  <h1>Hello World</h1>
               </Popup>
               }
            </Map>
            <button onClick={() => location()}>
               <FaLocationArrow />
            </button>
        </div>
     )
}