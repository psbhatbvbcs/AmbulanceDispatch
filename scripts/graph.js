let genbutton = document.querySelectorAll('.vert')
let numvertices = document.getElementById('vertice')
let numedges = document.getElementById('edges')
let source = document.getElementById('source')
let destination = document.getElementById('destination')
const button2 = document.getElementById('6');
let path = document.getElementById('path')
let mat = document.getElementById('matrix')
let sortedmessage = document.getElementById('f')
let priorarr = document.getElementById('priorarr')
let indarr = document.getElementById('indarr')
let newdisplay = document.getElementById('anim')
let searchedpatient = document.getElementById('searchedpatient')

var srcid
var destid
let tempprior

var rows
var cols
var myGrid

const minValue = 8
const maxValue = 48
const intervalTime = 1500
let prioritylist
let priorityarr
let indarray
let k = 1
let z = 1

let dist = new Array(rows)
let sptSet = new Array(cols)
let pred = new Array(50)

var pathdest
var finalpath = 'Quick! To reach the patient follow these roads with minimum traffic:\n'
var trafficlights = '\nAll the traffic signals have been turned to green to help you :)\n\n'
let isGenerating = true;
let intervalId

let nodes = [];
let nodesnew = [];
let links = [];
let linksnew = [];

function generateGraph(svg) {
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(400))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2 - 100));

  const link = d3.select(svg)
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link");


  const node = d3.select(svg)
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("r", 10)
    .attr("class", d => "node " + d.color);

  node.append("circle")
    .attr("r", 10)
    .attr("cx", 0)
    .attr("cy", 0);

  node.append("text")
    .text(d => d.id)
    .attr("dx", -40)
    .attr("dy", -10)
    .attr("font-style", "bold");

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`);
  })
}

function generateGraphnew(svg) {
  const simulation1 = d3.forceSimulation(nodesnew)
    .force("link1", d3.forceLink(linksnew).id(w => w.id).distance(250))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2 - 100));

  const link1 = d3.select(svg)
    .selectAll("line")
    .data(linksnew)
    .enter()
    .append("line")
    .attr("class", "link1");


  const node1 = d3.select(svg)
    .selectAll("g")
    .data(nodesnew)
    .enter()
    .append("g")
    .attr("r", 10)
    .attr("class", w => "node1 " + w.color);

  node1.append("circle")
    .attr("r", 10)
    .attr("cx", 0)
    .attr("cy", 0);

  node1.append("text")
    .text(w => w.id)
    .attr("dx", -40)
    .attr("dy", -10)
    .attr("font-style", "bold");

  simulation1.on("tick", () => {
    link1
      .attr("x1", w => w.source.x)
      .attr("y1", w => w.source.y)
      .attr("x2", w => w.target.x)
      .attr("y2", w => w.target.y);

    node1
      .attr("transform", w => `translate(${w.x},${w.y})`);
  })
}

function onclickgen() {
  genbutton.forEach(pressed => {
    pressed.onclick = () => {
      if (pressed.value == 'novertices') {
        rows = (Number)(document.getElementById('vertice').value)
        cols = (Number)(document.getElementById('vertice').value)
        generateNodes()
        console.log(nodes)
      }
      else if (pressed.value == 'submitsrc') {
        srcid = (Number)(source.value)
        console.log(srcid)
      }
      else if (pressed.value == 'sorter') {
        sortpatients()
        console.log(destid)
      }
      else if (pressed.value == 'submitmatrix') {
        if (k <= rows - 1) {
          createMatrix()
          displaypatientdet(destid)
          sendAmbulance()
          d3.select("#graph1").remove();
          document.getElementById('ss').innerHTML = `<svg id="graph1" width="1920" height="700"></svg>`
          generateGraphnew('#graph1')
          let temp = finalpath + pathdest + trafficlights
          path.innerText = " "
          path.innerText = temp
          console.log(pathdest)
          destid = indarray[rows - 1 - k]
          tempprior = priorityarr[rows-1-k]
          console.log(destid)
        }
        else {
          alert("All Patients Picked Up!")
          console.log(patientsadmitted)
        }
        k++
      }
      else if (pressed.value == 'gentraffic') {
        intervalId = setInterval(createRandomMatrix, intervalTime);
      }
      else if (pressed.value == 'updatestatus') {
        //startAnimation()
        if (k <= rows - 1) {
          stopGenerating()
          createMatrix()
          displaypatientdet(destid)
          sendAmbulance()
          d3.select("#graph1").remove();
          document.getElementById('ss').innerHTML = `<svg id="graph1" width="1920" height="700"></svg>`
          generateGraphnew('#graph1')
          let temp = finalpath + pathdest + trafficlights
          path.innerText = " "
          path.innerText = temp
          console.log(pathdest)
          destid = indarray[rows - 1 - k]
          tempprior = priorityarr[rows-1-k]
          console.log(destid)
          intervalId = setInterval(createRandomMatrix, intervalTime)
        }
        else {
          alert("All Patients Picked Up!")
          stopGenerating()
        }
        k++
      }
      else if (pressed.value == 'changepage') {
        stopGenerating()
        document.getElementById('ambulanceres').style.display = 'none'
        document.getElementById('changer').style.display = 'block'
      }
      else if (pressed.value == 'searcher') {
        searchpatient()

      }
      else if (pressed.value == 'getroom') {
        getroomno()
      }
      else if (pressed.value == 'discharge') {
        dischargepatient()
      }
    }
  })
}

function sendAmbulance() {
  if(tempprior<=10 && tempprior>6){
    let output = ambulances[2]
    let headings = ""
    let content = "Ambulance Sent:\n"
    for (let x in output) {
      headings += `${x} `
    }
    headings = headings.toUpperCase()
    let heads = headings.split(' ')
    let k = 0
    for (let x in output) {
      content += `${heads[k]}: ${output[x]}\n`
      k++
    }
    // searchedpatient.innerText = ''
    // searchedpatient.innerText = content
    alert(content)
  }
  else if(tempprior<=6 && tempprior>3){
    let output = ambulances[1]
    let headings = ""
    let content = "Ambulance Sent:\n"
    for (let x in output) {
      headings += `${x} `
    }
    headings = headings.toUpperCase()
    let heads = headings.split(' ')
    let k = 0
    for (let x in output) {
      content += `${heads[k]}: ${output[x]}\n`
      k++
    }
    // searchedpatient.innerText = ''
    // searchedpatient.innerText = content
    alert(content)
  }
  else{
    let output = ambulances[0]
    let headings = ""
    let content = "Ambulance Sent:\n"
    for (let x in output) {
      headings += `${x} `
    }
    headings = headings.toUpperCase()
    let heads = headings.split(' ')
    let k = 0
    for (let x in output) {
      content += `${heads[k]}: ${output[x]}\n`
      k++
    }
    // searchedpatient.innerText = ''
    // searchedpatient.innerText = content
    alert(content)
  }
}

function getroomno() {
  let temp = patientsadmitted[foundpatientind].roomno
  alert(`Room Number: ${temp}`)
}

function dischargepatient() {
  searchedpatient.innerText = ''
  patientsadmitted[foundpatientind] = {}
  alert("Patient Discharged!")
}

function sortpatients() {
  prioritylist = (document.getElementById('prioritypat')).value
  priorityarr = prioritylist.replace(/\n/g, " ").split(" ")
  indarray = []

  for (let i = 0; i < rows; i++) {
    indarray.push(i)
    priorityarr[i] = (Number)(priorityarr[i])
  }

  var i, j, min_ind;
  for (i = 0; i < rows - 1; i++) {
    min_ind = i;
    for (j = i + 1; j < rows; j++) {
      if (priorityarr[j] < priorityarr[min_ind]) {
        min_ind = j;
      }
    }

    var temp = priorityarr[min_ind]
    priorityarr[min_ind] = priorityarr[i]
    priorityarr[i] = temp
    
    var temp2 = indarray[min_ind]
    indarray[min_ind] = indarray[i]
    indarray[i] = temp2

  }

  destid = indarray[rows - 1]
  tempprior = priorityarr[rows - 1]
  console.log(priorityarr)
  console.log(indarray)
  let s1 = "Condition: "
  let s2 = "Patient ID: "
  for (let i = 1; i < rows; i++) {
    s1 += `${priorityarr[i]} <- `
    s2 += `${indarray[i]} <- `
  }

  sortedmessage.innerText = "The order of patients after sorting. So selected the most critical patient as destination"
  priorarr.innerText = s1
  indarr.innerText = s2
}


let foundpatientind

function searchpatient() {
  let flag = 0
  let searchname = document.getElementById('searchname').value
  let i
  for (i = 0; i < rows - 1; i++) {
    console.log(patientsadmitted[i].name)
    console.log(JSON.stringify(searchname))
    if (patientsadmitted[i].name == searchname) {
      let output = patientsadmitted[i]
      let headings = ""
      let content = "The patient details are:\n"
      for (let x in output) {
        headings += `${x} `
      }
      headings = headings.toUpperCase()
      let heads = headings.split(' ')
      let k = 0
      for (let x in output) {
        content += `${heads[k]}: ${output[x]}\n`
        k++
      }
      searchedpatient.innerText = ''
      searchedpatient.innerText = content
      console.log(content)
      console.log("HOLAAAAAAAAAAA")
      flag = 1
      foundpatientind = i
    }
  }
  if (flag == 0) {
    alert("Patient not found!")
    document.getElementById('disroom').style.display = 'none'
  }
  else {
    console.log("BLOCKBLOCK")
    document.getElementById('disroom').style.display = 'block'
  }
}
function displaypatientdet(destid) {
  let patientdetails = document.getElementById('patientdetails')
  let output = patients[destid]
  let headings = ""
  let content = "The patient details are:\n"

  patientsadmitted.push(patients[destid])
  patientsadmitted[z - 1].roomno = z
  z++
  for (let x in output) {
    headings += `${x} `
  }
  headings = headings.toUpperCase()
  let heads = headings.split(' ')
  let i = 0
  for (let x in output) {
    content += `${heads[i]}: ${output[x]}\n`
    i++
  }
  patientdetails.innerText = ''
  patientdetails.innerText = content
}

function generateNodes() {
  let numv = (document.getElementById('vertice')).value
  V = numv
  for (let i = 0; i < numv; i++) {
    nodes.push({ id: JSON.stringify(i), color: 'red' })
  }
}

function createMatrix() {
  nodes = []
  nodesnew = []
  links = []
  linksnew = []
  let weightedmat = (document.getElementById('matdata')).value
  myGrid = [...Array((Number)(numvertices.value))].map(e => Array((Number)(numvertices.value)));
  let weights = weightedmat.replace(/\n/g, " ").split(" ")
  let k = 0
  for (i = 0; i < numvertices.value; i++) {
    for (let j = 0; j < numvertices.value; j++) {
      myGrid[i][j] = (Number)(weights[k])
      k++
    }
  }

  createEdges()
  dijkstra(myGrid, srcid)
  changeNodes()
}

function createRandomMatrix() {
  nodes = []
  nodesnew = []
  links = []
  linksnew = []
  let weightedmat = (document.getElementById('matdata')).value
  myGrid = [...Array((Number)(numvertices.value))].map(e => Array((Number)(numvertices.value)));
  let weights = weightedmat.replace(/\n/g, " ").split(" ")
  let k = 0
  for (i = 0; i < numvertices.value; i++) {
    for (let j = 0; j < numvertices.value; j++) {
      myGrid[i][j] = (Number)(weights[k])
      k++
    }
  }

  let str = "Changing Traffic:\n"
  for (let i = 0; i < rows; i++) {
    for (let j = i; j < cols; j++) {
      if (i != j && myGrid[i][j] != 0) {
        let newValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        myGrid[i][j] = newValue;
        myGrid[j][i] = newValue;
      }
      else {
        myGrid[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < rows; i++) {
    str += '[ '
    for (let j = 0; j < cols; j++) {
      str += `${myGrid[i][j]}\t`
    }
    str += ' ]\n'
  }

  console.log(myGrid)
  mat.innerText = ''
  mat.innerText = str
  createEdges()
  dijkstra(myGrid, srcid)
  changeNodes()
  console.log(nodesnew)
}

function createEdges() {
  let temp = myGrid
  for (let i = 0; i < rows; i++) {
    for (let j = i; j < cols; j++) {
      if (temp[i][j] != 0) {
        links.push({ source: JSON.stringify(i), target: JSON.stringify(j) })
      }
    }
  }
  console.log(links)
}

function changeNodes() {
  console.log("Patient \t\t Distance from Hospital\n")
  console.log(pred)
  linksnew = links
  pathdest = ` Of patient ${destid}: `
  for (let i = 0; i < rows; i++) {
    if (i == destid) {
      nodesnew = []
      j = i
      for (let k = 0; k < rows; k++) {

        if (k != srcid && k != j && k != destid) {
          nodesnew.push({ id: JSON.stringify(k), color: 'red' })
        }
        else {
          nodesnew.push({ id: `${k}`, color: 'green' })
          pathdest += `${k} -> `
        }
        j = pred[j]
      }
    }
  }
  console.log(nodesnew)
}

function dijkstra(myGrid, srcid) {
  let graph = myGrid

  console.log(V)
  for (let i = 0; i < rows; i++) {
    dist[i] = Number.MAX_VALUE
    pred[i] = srcid
    sptSet[i] = false
  }

  dist[srcid] = 0;

  for (let count = 0; count < rows - 1; count++) {
    let u = minDistance(dist, sptSet);

    sptSet[u] = true;


    for (let v = 0; v < rows; v++) {
      if (!sptSet[v] && graph[u][v] != 0 &&
        dist[u] != Number.MAX_VALUE &&
        dist[u] + graph[u][v] < dist[v]) {
        console.log(graph[u][v])
        dist[v] = dist[u] + graph[u][v]
        pred[v] = u
      }
    }
  }
}

function minDistance(dist, sptSet) {

  let min = Number.MAX_VALUE;
  let min_index = -1;

  for (let v = 0; v < rows; v++) {
    if (sptSet[v] == false && dist[v] <= min) {
      min = dist[v];
      min_index = v;
    }
  }
  return min_index;
}

function startAnimation() {
  const wrapper = document.getElementById('anim');
  var dotCount = 0;
  const dotInterval = setInterval(() => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    const left = Math.floor(Math.random() * wrapper.offsetWidth);
    const top = Math.floor(Math.random() * wrapper.offsetHeight);
    dot.style.left = `${left}px`;
    dot.style.top = `${top}px`;
    wrapper.appendChild(dot);
    dotCount++;
    if (dotCount === 50) {
      clearInterval(dotInterval);
    }
  }, 200);
}

function stopGenerating() {
  clearInterval(intervalId);
  isGenerating = false;
}

onclickgen()
