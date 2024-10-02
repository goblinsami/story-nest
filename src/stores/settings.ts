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
    updateStory(story) {
      // console.log('IN STORE updateStory', story)
      this.story = story
    },

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

      this.story.acts.unshift(newAct)
    },

    deleteScene(actIndex, sceneIndex) {
      console.log(actIndex, sceneIndex)

      let act = this.story.acts[actIndex]
      act.scenes.splice(sceneIndex, 1)

    },

    deleteAct(actIndex) {
      this.story.acts.splice(actIndex, 1)
    },

    addPlotToScene(actIndex, sceneIndex) {
      let act = this.story.acts[actIndex]

      let scene = act.scenes[sceneIndex]

      scene.plots.push(1)
      scene.intensity = 5
    },

    addScene(position, act, newScene) {


      let updatedAct = this.story.acts.find(el => el.title == act.title)
      console.log(act.title, updatedAct)

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

    }
  },
  getters: {
    getStory() {
      return this.story; // Devolver el store completo
    },
  },
});
