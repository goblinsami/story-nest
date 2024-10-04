//@ts-nocheck
import { defineStore } from 'pinia';
import { CostResult } from '../interfaces/interfaces';
import { maxRegisters } from "../constants/constants.json";


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    story: {},
    showPlotChart: true,
    showPieChart: false,
    showEditor: false,
    showReader: false,
    showChartSettings: true,
    showCarousel: true,
    chartHeight: 50,
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
    ]


  }),
  actions: {

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

    //EDIT STORY
    updateStory(story) {
      this.story = story
    },

    deleteStory(story) {
      let text = "Quieres eliminar la historia?";
      if (confirm(text) == true) {
        this.story = {
          title: "",
          description: "",
          plots: [],
          acts: [
            {
              title: "Acto 1",
              description: "descActo 1",
              scenes: []
            }
          ]
        }
      }
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

    //SCENES

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

    editScene(newScene) {
      let updatedAct = this.story.acts[newScene.actIndex]
      let updatedScene = updatedAct.scenes.find(element => element.number == newScene.number)

      updatedScene.title = newScene.title
      updatedScene.description = newScene.description
      updatedScene.plots = newScene.plots
      updatedScene.intensity = newScene.intensity
      if (!updatedScene.plots.length) {
        updatedScene.plots.push(1)
        updatedScene.intensity = 5
      }


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
    //EDIT SCENES
    addNumeration(actIndex, sceneIndex) {
      let sceneNumber = 1; // Inicializa el número de escena
      this.story.acts.forEach(act => {
        act.scenes.forEach(scene => {
          scene.number = sceneNumber++; // Asigna el número de escena y lo incrementa
        });
      });

    },



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
