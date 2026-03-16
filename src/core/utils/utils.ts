import { envs } from "src/config/envs";
import { LostPet } from "../db/entities/lost-pet.entity";

export const generateMapboxImage = (
    lat:number,
    lon:number,
    lost_pets: LostPet[]
) : string =>{
    const accessToken = envs.MAPBOX_TOKEN;
    const zoom = 15;
    const width = 560;
    const height = 280;
    let lostPins = "";
    
    if (lost_pets.length > 0) {
        lostPins = lost_pets.map( pet => {
        const lon = pet.location.coordinates[0];
        const lat = pet.location.coordinates[1];
        return `pin-s-l+000(${lon},${lat})`;
        })
        .join(',');
    }
    

    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/
        pin-l+ff0000(${lon},${lat})
        ${lostPins}
        /${lon},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`.replace(/\s+/g, "");
}

//    ,${lostPins} */