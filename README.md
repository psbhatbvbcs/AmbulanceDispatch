# Visualizing_Real_Time_Patient_Routing_and_Ambulance_Dispatch
Visualize Patient routing and Ambulance Dispatch with D3.js, Javascript, HTML, and CSS.

The project takes in input of the number of vertices, a weight adjacency matrix depicting the traffic between the patients on connected roads.
Default node of hospital is 0.
Input for priority of patients in order. (remember to set priority of 0th index as 0 as it is the hospital)
The algorithm then sets the patient with the highest priority as the destination with the hospital (0th node) as the source.
On clicking Generate Traffic Button, random traffic is generated on the connected roads every 1.5 seconds. 
Clicking on Update Status button gives the route to the patient at that point of time with the current traffic. 
Update Status can be clicked until all the patients are picked up.

Provided functionality to search for the admitted patients after picking them up by ambulance. Option to get room number or discharge the patient.
Dicharging removes the patient from the database and can't be searched again.
