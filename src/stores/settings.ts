//@ts-nocheck
import { defineStore } from 'pinia';
import { CostResult } from '../interfaces/interfaces';
import { maxRegisters } from "../constants/constants.json";


export const useSettingsStore = defineStore('settings', {
  state: () => ({
    story: {},
    showPlotChart: false,
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
