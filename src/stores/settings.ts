//@ts-nocheck
import { defineStore } from 'pinia';
import { CostResult } from '../interfaces/interfaces';
import { maxRegisters } from "../constants/constants.json";


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    story: {},
    showPlotChart: true,
    showPieChart: false,
    showEditor: true,
    showReader: false,
    chartHeight: 50


  }),
  actions: {

    //TOGGLERS
    togglePlotChart() {
      this.showPlotChart = !this.showPlotChart
    },

    togglePieChart() {
      this.showPieChart = !this.showPieChart
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

    deleteScene(actIndex, sceneIndex) {
      console.log(actIndex, sceneIndex)

      let act = this.story.acts[actIndex]
      act.scenes.splice(sceneIndex, 1)

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
  },
});
