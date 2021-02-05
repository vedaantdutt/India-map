(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        var mapLayer;

        //leaflet map
        const osm = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        );

        //map layer
        mapLayer = L.map("map", {
          preferCanvas: true,
          layers: [osm],
          zoomControl: false,
        }).setView([23.0, 79.0], 4);

        //crosshair icon
        var crosshairIcon = L.icon({
          iconUrl: "/def-map-res/center-icon.png",
          iconSize: [20, 20], // size of the icon
          iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        });

        var crosshair = new L.marker(mapLayer.getCenter(), {
          icon: crosshairIcon,
          clickable: false,
        });
        crosshair.addTo(mapLayer);

        //move the crosshair to the center of the map when the user pans
        mapLayer.on("move", function (e) {
          crosshair.setLatLng(mapLayer.getCenter());
        });

        //zoom control
        const zoom = L.control.zoom({
          position: "bottomright",
        });
        zoom.addTo(mapLayer);

        //current location
        const currentLocation = L.control.locate({
          position: "bottomright",
          locateOptions: {
            enableHighAccuracy: true,
          },
        });
        currentLocation.addTo(mapLayer);

        mapLayer.on("locationfound", (e) => {
          console.log(e.latlng);
        });

        module.exports = mapLayer;
      },
      {},
    ],
    2: [
      function (require, module, exports) {
        // const { load } = require("nodemon/lib/config");

        var mapLayerLocal;

        defMapDisp();
        async function defMapDisp() {
          //loading the map
          mapLayerLocal =
            await require("/Users/dutt.vedaant/Desktop/default-map/public/map-fix.js");

          //search bar
          L.Control.searchBar = L.Control.extend({
            //onAdd: function
            onAdd: function (mapLayer2) {

              var text = L.DomUtil.create("input");
              var btn = L.DomUtil.create("button");
              btn.id = "searchBtn";
              var searchArea1 = L.DomUtil.create("div");
              var searchArea = L.DomUtil.create("div");
              // searchArea.style.display = "flex";
              searchArea1.style.display = "flex";
              searchArea.style.height = "25px";
              searchArea1.id = "search-area";
              searchArea1.style.width = "230px";
              searchArea1.style.height = "31px";
              text.id = "search-text";
              text.autocomplete = "one-time-code";
              text.autocomplete = "off";
              text.style.width = "70%";
              text.style.height = "25px";
              text.style.float = "left";
              text.autoActive = "false";
              btn.style.width = "30%";
              btn.style.height = "inherit";
              btn.style.float = "left";
              btn.innerHTML = "Search";
          

              var markFlag = false;
              var markSearch = null;
              var searchArea2 = null;

              function removeSearchArea2(key) {
                try {
                  searchArea.removeChild(searchArea2);
                  searchArea2 = null;
                } catch (e) {
                  //  console.log("no search area found", key, e);
                }
              }

              function removeMarker(key) {
                try {
                  mapLayer2.removeLayer(markSearch);
                  deleteCookie("coord");
                  markFlag = false;
                  markSearch = null;
                } catch (e) {
                  // console.log("no marker found", key, e)
                }
              }

              //called whenever the enter button is pressed
              async function search() {
                removeMarker("search");
                removeSearchArea2("search");

                // var markSearch;
                let searchKey = text.value;

                if (searchKey === "") {
                  return alert("Enter a place");
                } else if (searchKey.length < 3) {
                  return alert("more than 2 characters required");
                } else {
                  let outputLocal = [];

                  await $.ajax({
                    method: "get",

                    url:
                      "https://us1.locationiq.com/v1/search?key=pk.25eb2ca248fdb82ca2fd3c1343e7b8e0&q=" +
                      searchKey +
                      "&format=json&",
                    dataType: "json",
                    cache: false,
                    cors: true,
                  }).then(
                    async function (searchData) {
                      console.log(searchData);

                      if (searchData.length > 0) {
                        console.log("1");
                        // if (searchData.length == 1) {
                        // console.log(searchData[0]['geometry']['coordinates'][0])
                        // outputLocal[0] = searchData[0]['geometry']['coordinates'][1];
                        // outputLocal[1] = searchData[0]['geometry']['coordinates'][0];
                        // outputLocal[2] = searchData[0]['properties']['title'];
                        outputLocal[0] = searchData[0]["lat"];
                        outputLocal[1] = searchData[0]["lon"];
                        outputLocal[2] = searchData[0]["display_name"];
                      }
                    }
                    // }
                  );

                  if (outputLocal.length > 0) {
                    //Create custom icon
                    let customMarker = L.icon({
                      iconUrl: "def-map-res/map-marker-orange.png",
                      iconSize: [20, 40],
                      iconAnchor: [25, 50],
                      popupAnchor: [0, -50],
                    });

                    //Create marker variable
                    markSearch = new L.Marker(
                      [outputLocal[0], outputLocal[1]],
                      { icon: customMarker }
                    );
                    markSearch.bindPopup(outputLocal[2]);
                    mapLayer2.addLayer(markSearch);
                    setCookie(
                      "coord",
                      JSON.stringify([outputLocal[0], outputLocal[1]])
                    );
                    mapLayer2.panTo(
                      new L.LatLng(outputLocal[0], outputLocal[1]),
                      8
                    );
                    markFlag = true;
                    return console.log("search done");
                  }
                  return alert("nothing found");
                  // return;
                }
              }

              async function autoCmp() {
                let currentVal = text.value;
                removeSearchArea2("autocmp");
                // console.log(currentVal);
                //something typed if(
                if (currentVal.length >= 3) {
                  let k = 0;
                  let searchComplete = [];

                  await $.ajax({
                    method: "get",

                    url:
                      "https://us1.locationiq.com/v1/search?key=pk.25eb2ca248fdb82ca2fd3c1343e7b8e0&q=" +
                      currentVal +
                      "&format=json&",
                    // url: 'https://msearch.gsi.go.jp/address-search/AddressSearch?q=' + currentVal,
                    // url: 'https://geocode.maps.co/search?q=' + currentVal,
                    dataType: "json",
                    cache: false,
                    cors: true,
                  })
                    .then(async function (searchData) {
                      // console.log(searchData);
                      //only if there are some suggestions
                      // var searchSuggestSet = L.DomUtil.create('div');
                      // lowerCurrentVal
                      if (searchData.length > 0) {

                        for (let i = 0; i < searchData.length; i++) {
                        
                          if (k < 4) {
                            searchComplete[k] = searchData[i]["display_name"];
                            searchData[i]["display_name"] = "";
                            k++;
                            continue;
                          }
                         
                        }
                      }
                    })
                    .catch(function (err) {
                      console.error("Error:", err);
                    });

                 
                  if (searchComplete.length != 0) {
                    removeSearchArea2("new searchOpt");
                    searchArea2 = L.DomUtil.create("div");
                    searchArea2.style.width = searchArea1.style.width;

                    for (let j = 0; j < searchComplete.length; j++) {
                      let searchOpt = L.DomUtil.create("div");
                      searchOpt.style.height = "fit-content";
                      searchOpt.style.backgroundColor = "white";
                      searchOpt.style.padding = "1px 2px";
                      searchOpt.style.width = "80%";
                      searchOpt.style.border = "solid 1px black";

                      let regex = new RegExp(currentVal, "g");
                      searchOpt.innerHTML = searchComplete[j].replace(
                        regex,
                        "<span style='font-weight:bold;'>" +
                          currentVal +
                          "</span>"
                      );

                      // searchOpt.innerHTML = searchComplete[j];
                      searchOpt.style.color = "blue";
                      // searchOpt.innerHTML= searchComplete[j].replace(currentVal, "<span style='font-weight:bold'>currentVal</span>");
                      searchOpt.style.float = "left";

                      searchOpt.addEventListener(
                        "mouseover",
                        async function (e) {
                          this.style.fontWeight = "bold";

                          this.addEventListener("mouseout", function (e1) {
                            this.style.fontWeight = "normal";
                            e1.stopPropagation(); // prevent
                          });

                          this.addEventListener("click", function (e2) {
                            // console.log(e.target.innerHTML);
                            // text.value = e.target.innerHTML;
                            text.value = searchComplete[j];
                            e2.stopPropagation();
                            e.stopPropagation();
                            btn.click();

                            // search();
                          });

                          e.stopPropagation();
                        }
                      );

                      searchArea2.appendChild(searchOpt);
                    }
                    // console.log(searchArea2);
                    searchArea.appendChild(searchArea2);
                    return;
                  }
                  return;
                }
                return;
              }

              text.addEventListener("keyup", function (e) {
                e.stopPropagation();
                autoCmp();
              });


              text.addEventListener("click", function (e) {
                e.stopPropagation();
                // console.log("Try-------------------------------", this.value);
                if (this.value != "") {
                  autoCmp();
                }
              });

              btn.addEventListener("click", async function (e) {
                e.stopPropagation();
               return search();
              });

              mapLayer2.addEventListener("click", async function (e) {
                console.log("clicked on map");
                removeSearchArea2("map");
                removeMarker("map");

                // return mapLayer2;
              });

              searchArea1.appendChild(text);
              searchArea1.appendChild(btn);
              searchArea.appendChild(searchArea1);

              return searchArea;
            },
            onRemove: function (mapLayer2) {
              // Nothing to do here
            },
          });

          L.control.searchBar = function (opts) {
            return new L.Control.searchBar(opts);
          };

          L.control.searchBar({ position: "topright" }).addTo(mapLayerLocal);
        }

  
        //after the HTML dom loads completely

        // $(function () {
        //   function onEachFeature(feature, layer) {
        //     if (feature.properties && feature.properties.popupContent) {
        //       layer.bindPopup(feature.properties.popupContent);
        //     }
        //   }

        //   //only when somethihg is checked



        //   mapLayerLocal.on("moveend", async function () {




        //   }
        
        // );

        //   //
        //   //

      

       
        // });

        function setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }

        function deleteCookie(cname) {
          document.cookie =
            cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        //
      },
      { "/Users/dutt.vedaant/Desktop/default-map/public/map-fix.js": 1 },
    ],
  },
  {},
  [2]
);
