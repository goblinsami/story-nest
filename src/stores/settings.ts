//@ts-nocheck
import { defineStore } from 'pinia';
import { CostResult } from '../interfaces/interfaces';
import { maxRegisters } from "../constants/constants.json";
import { v4 as uuidv4 } from 'uuid';


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    story: {},
    showPlotChart: true,
    showPieChart: false,
    showEditor: false,
    showReader: false,
    showChartSettings: false,
    showCarousel: true,
    chartFontSize: 15,
    chartHeight: 40,
    originalStory: {},
    colorsHard: [
      "#FF5733", // Rojo anaranjado
      "#33FF57", // Verde lima
      "#3357FF", // Azul
      "#F1C40F", // Amarillo
      "#9B59B6", // Púrpura
      "#E67E22", // Naranja
      "#2ECC71", // Verde esmeralda
      "#3498DB", // Azul claro
      "#E74C3C", // Rojo
      "#1ABC9C", // Verde aguamarina
      "#8E44AD", // Púrpura oscuro
      "#F39C12", // Amarillo anaranjado
      "#D35400", // Naranja oscuro
      "#2C3E50", // Azul oscuro
      "#ECF0F1", // Gris claro
      "#95A5A6", // Gris
      "#7F8C8D", // Gris oscuro
    ],
    plotColorsHard: [
      "#FF5733", // Rojo anaranjado
      "#33FF57", // Verde lima
      "#3357FF", // Azul
      "#F1C40F", // Amarillo
      "#9B59B6", // Púrpura
      "#E67E22", // Naranja
      "#2ECC71", // Verde esmeralda
      "#3498DB", // Azul claro
      "#E74C3C", // Rojo
      "#1ABC9C", // Verde aguamarina
      "#8E44AD", // Púrpura oscuro
      "#F39C12", // Amarillo anaranjado
      "#D35400", // Naranja oscuro
      "#2C3E50", // Azul oscuro
      "#ECF0F1", // Gris claro
      "#95A5A6", // Gris
      "#7F8C8D", // Gris oscuro
    ],
    colorPalettes: [
      {
        name: "coldTones",
        colors: [
          "#6497b1",  // Dark Blue
          "#3A1078",  // Vibrant Purple
          "#2879b9",  // Deep Indigo
          "#7E60BF",  // Magenta
          "#d45087",  // Bright Pink
          "#f95d6a",  // Coral Red
          "#ff7c43",  // Bright Orange
          "#ffa600",  // Vivid Yellow
          "#00b5e2",  // Light Cyan
          "#00838f",  // Deep Teal
          "#046b99",  // Ocean Blue
          "#5c2f8b",  // Violet
          "#374c80",  // Slate Blue
          "#2879b9",  // Bold Sky Blue
          "#0070ad",  // Electric Blue
          "#6497b1",  // Muted Light Blue
        ]
      }, {
        name: "warmTones",
        colors: [
          "#FF5733",  // Red Orange
          "#FF6F61",  // Coral
          "#FF8D2D",  // Bright Orange
          "#FFC300",  // Golden Yellow
          "#FFBB33",  // Sunflower Yellow
          "#FFD700",  // Gold
          "#FF9F00",  // Pumpkin
          "#FF6B00",  // Carrot
          "#D50000",  // Crimson Red
          "#C70039",  // Deep Pink
          "#F02C3A",  // Tomato Red
          "#FF4E50",  // Ruby Red
          "#FF7F50",  // Coral Pink
          "#FF8F00",  // Bright Amber
          "#FF4B00",  // Vermilion
          "#FFB5B3",  // Light Salmon
        ]
      }, {
        name: "jungleTones",
        colors: [
          "#3B7A57", "#4F7942", "#228B22", "#556B2F",
          "#6B8E23", "#A9DFBF", "#16A085", "#2ECC71",
          "#27AE60", "#145A32", "#0E6655", "#1ABC9C",
          "#52BE80", "#45B39D", "#82E0AA", "#239B56"
        ]
      }, {
        name: "highContrastTones",
        colors: [
          "#FF2D00", "#FF9500", "#FFD700", "#32CD32",
          "#008000", "#00FFFF", "#1E90FF", "#0000FF",
          "#8A2BE2", "#FF00FF", "#C71585", "#FF1493",
          "#DC143C", "#000000", "#FFFFFF", "#FF69B4"
        ]
      }, {
        name: "darkNightTones",
        colors: [
          "#1C1C1C", "#2C3E50", "#34495E", "#2C2C54",
          "#4C4B63", "#0A3D62", "#1B1464", "#5D6D7E",
          "#283747", "#212F3D", "#17202A", "#1A5276",
          "#5D6D7E", "#515A5A", "#566573", "#641E16"
        ]
      }, {
        name: "candyPopTones",
        colors: [
          "#FF69B4", "#FFB6C1", "#FFDAB9", "#FF6347",
          "#FFA07A", "#FF4500", "#FFD700", "#FFA500",
          "#FF4500", "#FF00FF", "#FFC0CB", "#FF1493",
          "#FF69B4", "#FF85B3", "#FF97D1", "#F08080"
        ]
      },

    ],
    selectedPalette: 0,


  }),
  actions: {

    //FILTERS

    filterScenesByPlot() {
      let filteredScenes = [];

      this.story.acts.forEach((act) => {
        act.scenes.forEach(scene => {
          if (scene.characters && scene.characters.includes(characterName)) {
            filteredScenes.push(scene);
          }
        });
      });

      return filteredScenes;
    },
    filterAndUpdateScenesByCharacters(charactersArray) {
      // Si no se ha guardado el estado original de las escenas, lo hacemos.
      if (!this.originalStory) {
        this.originalStory = JSON.parse(JSON.stringify(this.story)); // Guardamos una copia profunda del estado original
      }

      // Si el array de personajes está vacío, restauramos las escenas originales
      if (charactersArray.length === 0) {
        this.story.acts.forEach((act, index) => {
          act.scenes = this.originalStory.acts[index].scenes; // Restauramos las escenas originales
        });
      } else {
        // Filtrar las escenas del acto por los personajes
        this.story.acts.forEach((act, index) => {
          act.scenes = this.originalStory.acts[index].scenes.filter(scene =>
            scene.characters && charactersArray.some(character => scene.characters.includes(character))
          );
        });
      }
    },


    //TOGGLERS
    togglePlotChart() {
      this.showPlotChart = !this.showPlotChart
    },

    toggleShowCarousel() {
      this.showCarousel = !this.showCarousel
    },


    togglePieChart() {
      this.showPieChart = !this.showPieChart
    },

    toggleShowChartSettings() {
      this.showChartSettings = !this.showChartSettings
    },

    toggleEditor() {
      this.showEditor = !this.showEditor
    },
    toggleReader() {
      this.showReader = !this.showReader
    },

    changePalette(selectedPalette) {
      console.log(selectedPalette)
      this.addColorToActs(selectedPalette)
    },

    //EDIT STORY
    updateStory(story) {
      this.story = story
    },

    deleteStory(story) {
      let text = "Quieres eliminar la historia?";

      let defaultScene = {
        title: "Nueva Escena",
        description: "",
        duration: 10,
        plots: [],
        intensity: null
      }

      if (confirm(text) == true) {
        this.story = {
          title: "title",
          description: "description",
          plots: [],
          characters: [],
          acts: [
            {
              title: "Acto 1",
              description: "descActo 1",
              scenes: [{ ...defaultScene }]
            },
            {
              title: "Acto 2",
              description: "descActo 1",
              scenes: [{ ...defaultScene }]
            },
            {
              title: "Acto 3",
              description: "descActo 1",
              scenes: [{ ...defaultScene }, { ...defaultScene }]
            }
          ]
        }
      }
      this.addColorToActs()
      this.addNumeration()
    },

    //ACTS
    addAct() {
      let newAct = {
        title: "Nuevo acto",
        description: "nuevo acto",
        scenes: [{
          title: "Nueva Escena",
          description: "",
          duration: 10,
          plots: [],
          intensity: null
        }]
      }

      this.story.acts.push(newAct)
    },

    deleteAct(actIndex) {
      this.story.acts.splice(actIndex, 1)
    },
    addColorToActs(selectedPalette = 0) {
      // Aquí puedes definir una lista de colores o asignarlos de forma dinámica.
      this.story.acts.forEach((act, index) => {
        // Asignar un color desde la lista o generar uno dinámico
        act.color = this.colorPalettes[selectedPalette].colors[index]
      });
    },

    changeActColor(act, color) {
      let updatedAct = this.story.acts[actIndex]

    },

    //CHARACTERS

    createCharacter(name) {
      let lastId = 1
      if (this.story.characters.length) {
        lastId = this.story.characters[this.story.characters.length - 1].id
      }
      let newCharacter = { id: lastId, title: name }
      this.story.characters.push(newCharacter)
    },

    deleteCharacter(index) {
      this.story.characters.splice(index, 1)

    },
    //SCENES

    dragScenesInCarousel(scene1, scene2, oldIndex, newIndex) {
      // Obtenemos el acto de origen y la escena a mover
      let originAct = this.story.acts[scene1.actIndex].scenes;
      let saveSceneIndex = originAct.findIndex(el => el.id === scene1.id);
      let saveScene = originAct[saveSceneIndex];

      // Obtenemos el acto de destino y el índice de la posición de destino
      let destinationAct = this.story.acts[scene2.actIndex].scenes;
      let newPosition = destinationAct.findIndex(el => el.id === scene2.id);

      // Eliminamos la escena de origen
      originAct.splice(saveSceneIndex, 1);

      // Insertamos la escena en la nueva posición del acto destino
      destinationAct.splice(newPosition, 0, saveScene);

      console.log('dragScenesInCarousel', saveScene, newPosition);
    },

    checkCharactersInScene() {
      // Itera sobre cada acto
      this.story.acts.forEach((act) => {
        // Itera sobre cada escena dentro del acto
        act.scenes.forEach(scene => {
          // Inicializa el array characters si no existe
          if (!scene.characters) {
            scene.characters = [];
          }

          // Itera sobre cada personaje
          this.story.characters.forEach(character => {
            // Verifica si el nombre del personaje está en el título o la descripción de la escena
            if (scene.title.includes(character.title) || scene.description.includes(character.title)) {
              // Asegúrate de que el personaje no esté ya en el array
              if (!scene.characters.includes(character.title)) {
                scene.characters.push(character.title);
              }
            }
          });
        });
      });

      // Alert opcional para verificar resultados
    },

    addScene(position, act, newScene) {
      console.log('STOREE!!', position, act.title, newScene)


      let updatedAct = this.story.acts.find(el => el.title == act.title)

      let newElement = {
        title: newScene.title || "Nueva Escena",
        description: newScene.description || "",
        duration: 10,
        plots: [],
        intensity: null
      }


      if (position == 'down') {
        updatedAct.scenes.push(newElement)
      } else {
        updatedAct.scenes.unshift(newElement)
      }

    },


    insertScene(position, actIndex, sceneIndex) {


      let updatedAct = this.story.acts[actIndex]
      let newElement = {
        title: "Nueva Escena",
        description: "",
        duration: 10,
        plots: [],
        intensity: null
      }


      if (position == 'down') {
        updatedAct.scenes.splice(sceneIndex + 1, 0, newElement);
      } else {
        updatedAct.scenes.splice(sceneIndex, 0, newElement);
      }

    },


    deleteScene(actIndex, sceneIndex) {
      console.log(actIndex, sceneIndex)

      let act = this.story.acts[actIndex]
      act.scenes.splice(sceneIndex, 1)

    },

    editSceneAndAddPlots(newScene) {
      let updatedAct = this.story.acts[newScene.actIndex]
      let updatedScene = updatedAct.scenes.find(element => element.number == newScene.number)
      if (updatedScene.plots.length == 0) {
        updatedScene.plots.push(1)
        updatedScene.intensity = 5
      }

    },

    deletePlotsfromScene(actIndex, sceneIndex, scene) {
      console.log(actIndex, sceneIndex)
      let act = this.story.acts[actIndex]
      let updatedScene = act.scenes[sceneIndex]

      updatedScene.plots = []

      console.log(act, updatedScene)
      /*       let updatedAct = this.story.acts[newScene.actIndex]
            let updatedScene = updatedAct.scenes.find(element => element.number == newScene.number)
            updatedScene.plots = [] */
    },

    editScene(newScene) {
      let updatedAct = this.story.acts[newScene.actIndex]
      let updatedScene = updatedAct.scenes.find(element => element.number == newScene.number)

      updatedScene.title = newScene.title
      updatedScene.description = newScene.description
      updatedScene.plots = newScene.plots
      updatedScene.intensity = newScene.intensity


      //  console.log('EDIT SCENE STORE', updatedScene, scene)

    },

    //PLOTS

    createPlot(plotTitle) {
      let lastId = 1
      if (this.story.plots.length) {
        lastId = this.story.plots[this.story.plots.length - 1].id
      }
      let newPlot = { id: lastId, title: plotTitle }
      this.story.plots.push(newPlot)
    },

    deletePlot(index) {
      console.log('DELETE PLOT', this.story.plots)
      this.story.plots.splice(index, 1)

    },

    addPlotToScene(actIndex, sceneIndex) {
      let act = this.story.acts[actIndex]

      let scene = act.scenes[sceneIndex]

      scene.plots.push(1)
      scene.intensity = 5
    },

  collapseScene(scene, localCollapse) {
    let updatedAct = this.story.acts[scene.actIndex]
    let updatedScene = updatedAct.scenes.find(el => el.id == scene.id)
    console.log(updatedScene)
    updatedScene.collapsedCarousel = !updatedScene.collapsedCarousel
    updatedScene.collapsed = !updatedScene.collapsed

  },
    collapseAllScenes(mode, actIndex) {
      console.log('collapseAllScenes', mode, actIndex)
      this.story.acts.forEach((act) => {
        act.scenes.forEach((scene) => {
          if (mode == 'carousel') {
            scene.collapsedCarousel = true
          } else if (mode == 'text-editor') {
            scene.collapsed = true
          }
        });
      });

      if (mode == 'act') {
        this.story.acts[actIndex].scenes.forEach((scene) => {
          scene.collapsed = true
        });
      }

    },
    expandAllScenes(mode, actIndex) {
      console.log('expandAllScenes', mode, actIndex)

      this.story.acts.forEach((act) => {
        act.scenes.forEach((scene) => {
          if (mode == 'carousel') {
            scene.collapsedCarousel = false
          } else if (mode == 'text-editor') {
            scene.collapsed = false
          }
        });
      });
      if (mode == 'act') {
        this.story.acts[actIndex].scenes.forEach((scene) => {
          scene.collapsed = false
        });
      }
    },
/*     toggleCollapseAllScenesFromAct(actIndex) {
      console.log('toggleCollapseAllScenesFromAct',  )
      this.story.acts[actIndex].scenes.forEach((scene) => {
        scene.collapsed = true
      });
    }, */


    //EDIT SCENES
    addNumeration() {
      let sceneNumber = 1; // Inicializa el número de escena
      this.story.acts.forEach((act, actIndex) => {
        act.scenes.forEach((scene, sceneIndex) => {
          const uniqueId = uuidv4(); // Genera un UUID por cada escena
          scene.id = uniqueId;
          scene.number = sceneNumber++; // Asigna el número de escena y lo incrementa
          scene.actIndex = actIndex; // Asigna el índice del acto
          scene.sceneIndex = sceneIndex; // Asigna el índice de la escena
          scene.collapsed = false
          scene.collapsedCarousel = false
        });
      });
    }



  },
  getters: {
    getScenesLength() {
      if (this.story) {
        return this.story.acts.reduce((total, act) => total + act.scenes.length, 0);

      }
    },
    getAllScenes() {
      if (this.story.acts) {
        // Obtener todas las escenas de todos los actos, añadiendo la propiedad 'actIndex'
        const scenesArray = this.story.acts.reduce((allScenes, act, actIndex) => {
          // Agregar la propiedad 'actIndex' a cada escena
          const updatedScenes = act.scenes.map(scene => ({
            ...scene,           // Copia las propiedades originales de la escena
            actIndex            // Añade la propiedad 'actIndex' con el índice del acto
          }));

          return [...allScenes, ...updatedScenes];
        }, []);

        // Si es necesario, ordena las escenas por algún criterio
        //  return scenesArray.sort((a, b) => a.number - b.number); // Suponiendo que cada escena tiene un "number"
        return scenesArray
      }
      return [];
    }


  },
});
