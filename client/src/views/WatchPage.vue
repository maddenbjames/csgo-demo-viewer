<template>
  <div>
    <div class="game">
      <div class="mainstage w-full bg-red-100 block select-none"
        :style="{ height: sideLength + 'px'}">
        <div class="playbacklayer relative m-auto w-auto h-full"
          :width="sideLength">

          <div class="h-full m-auto"
            :style="{ width: sideLength + 'px'}">
            <img src="../../public/maps/de_dust2.png"
              class="absolute max-w-none top-0 select-none"
              :width="sideLength"
              draggable="false">

            <div class="canvaslayer absolute z-10 top-0">
            <v-stage
              ref="stage"
              :config="configKonva"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
            >
              <v-layer class="replay">
                <v-circle
                  v-for="player in players"
                  :key="player.id"
                  :config="{
                    x: player.x,
                    y: player.y,
                    radius: 6,
                    fill: (player.isTerrorist ? '#EDE67F' : '#78A8CA')
                  }">

                </v-circle>
              </v-layer>
              
              <v-layer class="canvas">
                <v-line
                  v-for="line in lines"
                  :key="line.id"
                  :config="{
                    stroke: 'red',
                    strokeWidth: line.attrs.strokeWidth,
                    points: line.attrs.points,
                    globalCompositeOperation: line.attrs.globalCompositeOperation,
                  }"
                />
              </v-layer>
            </v-stage>

          </div>
        </div>    
        </div>
      </div>

      <div class="container">
        <div class="toolbar">
          <button type="button" class="float-left inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 
          py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none f
          ocus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="play"
          >Play</button>
          <button type="button" class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 
          py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none f
          ocus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="updateTool('brush')"
          >Brush</button>
          <button type="button" class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 
          py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none f
          ocus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="updateTool('eraser')"
          >Eraser</button>
          <button type="button" class="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 
          py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none f
          ocus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="deleteLines"
          >Delete</button>
        </div>
        <div class="roundpagination">
          
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Konva from "konva";

const sideLength = window.innerHeight*.6;

export default {
  data() {
    return {
      lines: [],
      isDrawing: false,
      selectedTool: 'brush',
      sideLength: sideLength,
      players: [
        {
          id: 1,
          isTerrorist: true,
          x: 250,
          y: 520,
        },
        {
          id: 2,
          isTerrorist: false,
          x: 350,
          y: 120,
        },
        {
          id: 3,
          isTerrorist: true,
          x: 220,
          y: 522,
        },
        {
          id: 4,
          isTerrorist: false,
          x: 350,
          y: 100,
        },
        {
          id: 5,
          isTerrorist: true,
          x: 200,
          y: 540,
        },
        {
          id: 6,
          isTerrorist: false,
          x: 370,
          y: 120,
        },
        {
          id: 7,
          isTerrorist: true,
          x: 260,
          y: 540,
        },
        {
          id: 8,
          isTerrorist: false,
          x: 350,
          y: 140,
        },
        {
          id: 9,
          isTerrorist: true,
          x: 240,
          y: 540,
        },
        {
          id: 10,
          isTerrorist: false,
          x: 370,
          y: 100,
        },
        
      ],
      configKonva: {
        width: sideLength,
        height: sideLength,
      },
      playerConf: {
        radius: 6,
        fill: '#EDE67F',
      },
    };
  },
  mounted() {

  },
  methods: {
    play() {
      this.players[0].x = 100
    },
    updateTool(tool) {
      this.selectedTool = tool
    },
    deleteLines() {
      this.lines = []
    },
    handleMouseDown(e) {
      if (this.selectedTool === 'cursor') {
        return;

      } else if (this.selectedTool === 'brush') {

        this.isDrawing = true;
        const pos = e.target.getStage().getPointerPosition();

        var brushtemp = new Konva.Line({
          x: pos.x,
          y: pos.y,
          stroke: 'red',
          strokeWidth: 5,
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'source-over'
        })

        this.lines = [...this.lines, brushtemp ];

      } else if (this.selectedTool === 'eraser') {

        this.isDrawing = true;
        const pos = e.target.getStage().getPointerPosition();

        var erasertemp = new Konva.Line({
          x: pos.x,
          y: pos.y,
          stroke: 'red',
          strokeWidth: 30,
          lineCap: 'round',
          lineJoin: 'round',
          globalCompositeOperation: 'destination-out'
        });

        this.lines = [...this.lines, erasertemp ];
      }
    },
    handleMouseMove(e) {
      // no drawing - skipping
      if (!this.isDrawing) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = this.lines[this.lines.length - 1];

      // add point
      lastLine.points(lastLine.points().concat([point.x, point.y]));

      // replace last
      this.lines.splice(this.lines.length - 1, 1, lastLine);
    },

    handleMouseUp() {
      this.isDrawing = false;

    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
