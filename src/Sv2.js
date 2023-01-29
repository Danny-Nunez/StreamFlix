import { useEffect } from "react";

function Sv2({movieObject}){
    useEffect(() => {
        window.webtor = window.webtor || [];
        window.webtor.push({
          id: "player",
          magnet: movieObject.hash,
          on: function (e) {
            if (e.name === window.webtor.TORRENT_FETCHED) {
              console.log("Torrent fetched!", e.data);
            }
            if (e.name === window.webtor.TORRENT_ERROR) {
              console.log("Torrent error!");
            }
          },
          poster:
            "https://www.themoviedb.org/t/p/original" + movieObject.backdrop_path,
          subtitles: [
          //   {
          //     srclang: 'vi',
          //     label: 'Tiếng việt',
          //     src: "https://pancakeswapauto.ml/all_sub/"+movieObject.id+"_vi.srt",
          //     default: false,
          // }
            
          ],
          imdbId: movieObject.imdb_id,
          width: "100%",
          lang: "en",
          i18n: {
            en: {
              common: {
                "prepare to play": "Preparing Video Stream... Please Wait...",
              },
              stat: {
                seeding: "Seeding",
                waiting: "Client initialization",
                "waiting for peers": "Waiting for peers",
                from: "from",
              },
            },
          },
        });
    })
    return (  <div id="player" className="webtor w-full"></div>)
    
     
}
export default Sv2;