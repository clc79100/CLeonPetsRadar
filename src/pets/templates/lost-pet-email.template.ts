import { LostPet } from "src/core/db/entities/lost-pet.entity";
import { FoundPetDto } from "src/core/interfaces/found-pet.interface";
import { generateMapboxImage } from "src/core/utils/utils";

export const generateLostPetEmailTemplate = (foundPet: FoundPetDto, lostPets: LostPet[]): string => {
  const imageUrl = generateMapboxImage(foundPet.lat, foundPet.lon, lostPets);
  const date = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const speciesIcon: Record<string, string> = {
    perro: '🐶',
    gato: '🐱',
    ave: '🐦',
    conejo: '🐰',
  };
  const icon =
    speciesIcon[foundPet.species.toLowerCase()] || '🐾';
 
  const photoBlock = foundPet.photo_url
    ? `<tr>
        <td style="padding:0 40px 28px;">
          <img src="${foundPet.photo_url}"
            width="520"
            style="width:100%;max-height:280px;object-fit:cover;border-radius:14px;display:block;"
            alt="Foto de la mascota"/>
        </td>
      </tr>`
    : '';
 
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Mascota Encontrada</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Georgia',serif;">
 
  <table width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#f0f4f8;padding:40px 16px;">
    <tr>
      <td align="center">
 
        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:20px;overflow:hidden;
                 box-shadow:0 8px 40px rgba(0,0,0,0.10);max-width:600px;width:100%;">
 
          <!-- ── HERO HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a3a4f 0%,#27ae60 100%);
                       padding:40px 40px 36px;position:relative;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <!-- Eyebrow -->
                    <p style="margin:0 0 10px;font-family:'Trebuchet MS',sans-serif;
                               font-size:11px;font-weight:700;letter-spacing:2.5px;
                               text-transform:uppercase;color:rgba(255,255,255,0.65);">
                      Sistema de Incidentes 612 &nbsp;·&nbsp; Mascota Encontrada
                    </p>
                    <!-- Icon + Title -->
                    <h1 style="margin:0;font-family:'Georgia',serif;font-size:32px;
                               font-weight:700;color:#ffffff;line-height:1.2;">
                      ${icon}&nbsp; ${foundPet.species}
                      <span style="font-size:20px;font-weight:400;
                                   color:rgba(255,255,255,0.8);"> — ${foundPet.breed}</span>
                    </h1>
                    <!-- Date badge -->
                    <div style="margin-top:14px;">
                      <span style="display:inline-block;background:rgba(255,255,255,0.18);
                                   color:#ffffff;font-family:'Trebuchet MS',sans-serif;
                                   font-size:12px;font-weight:600;padding:5px 14px;
                                   border-radius:20px;border:1px solid rgba(255,255,255,0.3);">
                        📅 Encontrado el ${date}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- ── PHOTO (opcional) ── -->
          ${photoBlock}
 
          <!-- ── DATOS DE LA MASCOTA ── -->
          <tr>
            <td style="padding:${foundPet.photo_url ? '0' : '32px'} 40px 0;">
              ${!foundPet.photo_url ? '<div style="height:32px;"></div>' : ''}
              <!-- Section label -->
              <p style="margin:0 0 16px;font-family:'Trebuchet MS',sans-serif;
                         font-size:10px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;color:#27ae60;">
                Datos de la Mascota
              </p>
              <!-- Grid 2×2 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-bottom:16px;padding-right:12px;
                                         vertical-align:top;">
                    <div style="background:#f7faf9;border-radius:10px;padding:14px 16px;
                                border-left:3px solid #27ae60;">
                      <p style="margin:0 0 4px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Especie</p>
                      <p style="margin:0;font-size:15px;color:#1a2e3b;font-weight:600;">
                        ${foundPet.species}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-bottom:16px;padding-left:12px;
                                         vertical-align:top;">
                    <div style="background:#f7faf9;border-radius:10px;padding:14px 16px;
                                border-left:3px solid #27ae60;">
                      <p style="margin:0 0 4px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Raza</p>
                      <p style="margin:0;font-size:15px;color:#1a2e3b;font-weight:600;">
                        ${foundPet.breed}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-right:12px;vertical-align:top;">
                    <div style="background:#f7faf9;border-radius:10px;padding:14px 16px;
                                border-left:3px solid #27ae60;">
                      <p style="margin:0 0 4px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Color</p>
                      <p style="margin:0;font-size:15px;color:#1a2e3b;font-weight:600;">
                        ${foundPet.color}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:12px;vertical-align:top;">
                    <div style="background:#f7faf9;border-radius:10px;padding:14px 16px;
                                border-left:3px solid #27ae60;">
                      <p style="margin:0 0 4px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Tamaño</p>
                      <p style="margin:0;font-size:15px;color:#1a2e3b;font-weight:600;">
                        ${foundPet.size}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- ── DESCRIPCIÓN ── -->
          <tr>
            <td style="padding:20px 40px 0;">
              <p style="margin:0 0 10px;font-family:'Trebuchet MS',sans-serif;
                         font-size:10px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;color:#27ae60;">
                Descripción
              </p>
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;
                         font-family:'Georgia',serif;">
                ${foundPet.description}
              </p>
            </td>
          </tr>
 
          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="border-top:1px solid #e5e7eb;"></div>
            </td>
          </tr>
 
          <!-- ── DATOS DEL ENCONTRADOR ── -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 16px;font-family:'Trebuchet MS',sans-serif;
                         font-size:10px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;color:#1a3a4f;">
                Datos de Contacto — Quien la Encontró
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:linear-gradient(135deg,#1a3a4f08,#27ae6008);
                       border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
                <tr>
                  <!-- Avatar inicial -->
                  <td width="64" style="padding:20px 0 20px 20px;vertical-align:middle;">
                    <div style="width:48px;height:48px;border-radius:50%;
                                background:linear-gradient(135deg,#1a3a4f,#27ae60);
                                text-align:center;line-height:48px;
                                font-family:'Trebuchet MS',sans-serif;
                                font-size:20px;font-weight:700;color:#fff;">
                      ${foundPet.finder_name.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td style="padding:20px 20px 20px 14px;vertical-align:middle;">
                    <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#1a2e3b;
                               font-family:'Trebuchet MS',sans-serif;">
                      ${foundPet.finder_name}
                    </p>
                    <p style="margin:0 0 2px;font-size:13px;color:#6b7280;
                               font-family:'Trebuchet MS',sans-serif;">
                      ✉️ <a href="mailto:${foundPet.finder_email}"
                            style="color:#27ae60;text-decoration:none;font-weight:600;">
                        ${foundPet.finder_email}
                      </a>
                    </p>
                    <p style="margin:0;font-size:13px;color:#6b7280;
                               font-family:'Trebuchet MS',sans-serif;">
                      📞 ${foundPet.finder_phone}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:28px 40px 0;">
              <div style="border-top:1px solid #e5e7eb;"></div>
            </td>
          </tr>
 
          <!-- ── UBICACIÓN ── -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 16px;font-family:'Trebuchet MS',sans-serif;
                         font-size:10px;font-weight:700;letter-spacing:2px;
                         text-transform:uppercase;color:#e74c3c;">
                Ubicación Donde Fue Encontrada
              </p>
              <!-- Dirección -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#fef7f7;border-radius:10px;
                       border-left:3px solid #e74c3c;margin-bottom:16px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 4px;font-family:'Trebuchet MS',sans-serif;
                               font-size:10px;font-weight:700;letter-spacing:1.5px;
                               text-transform:uppercase;color:#9ca3af;">Dirección</p>
                    <p style="margin:0;font-size:14px;color:#1a2e3b;font-weight:600;">
                      📍 ${foundPet.address}
                    </p>
                  </td>
                </tr>
              </table>
              <!-- Coordenadas -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:8px;">
                    <div style="background:#f7faf9;border-radius:10px;
                                padding:12px 16px;text-align:center;">
                      <p style="margin:0 0 2px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Latitud</p>
                      <p style="margin:0;font-size:14px;font-weight:700;
                                 color:#1a2e3b;font-family:monospace;">
                        ${foundPet.lat}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;">
                    <div style="background:#f7faf9;border-radius:10px;
                                padding:12px 16px;text-align:center;">
                      <p style="margin:0 0 2px;font-family:'Trebuchet MS',sans-serif;
                                 font-size:10px;font-weight:700;letter-spacing:1.5px;
                                 text-transform:uppercase;color:#9ca3af;">Longitud</p>
                      <p style="margin:0;font-size:14px;font-weight:700;
                                 color:#1a2e3b;font-family:monospace;">
                        ${foundPet.lon}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
          <!-- ── MAPA MAPBOX ── -->
          <tr>
            <td style="padding:20px 40px 32px;">
              <!-- Leyenda -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:10px;">
                <tr>
                  <td>
                    <span style="font-family:'Trebuchet MS',sans-serif;font-size:12px;
                                  color:#6b7280;">
                      <span style="color:#000000;font-weight:700;">●</span>
                      Mascotas perdidas &nbsp;&nbsp;
                      <span style="color:#e74c3c;font-weight:700;">●</span>
                      Lugar donde fue encontrada
                    </span>
                  </td>
                </tr>
              </table>
              <!-- Mapa -->
              <img src="${imageUrl}"
                width="520"
                style="width:100%;border-radius:14px;display:block;
                       box-shadow:0 4px 16px rgba(0,0,0,0.12);"
                alt="Mapa de ubicación — lugar perdido y encontrado"/>
            </td>
          </tr>
 
          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#1a3a4f;padding:20px 40px;border-radius:0 0 20px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Trebuchet MS',sans-serif;
                               font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;">
                      Reporte generado automáticamente el ${date}
                    </p>
                    <p style="margin:3px 0 0;font-family:'Trebuchet MS',sans-serif;
                               font-size:13px;color:#27ae60;font-weight:700;
                               letter-spacing:1px;">
                      Sistema de Incidentes 612
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
 
        </table>
      </td>
    </tr>
  </table>
 
</body>
</html>`;
}