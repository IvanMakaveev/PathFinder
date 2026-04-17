# PathFinder Project

## Summary
**PathFinder** is an app that allows the users to explore optimal shipments pathing when constraints are added to a graph network. The system provides multiple types of node types, node modifiers and shipment constraints, which can all impact the result of the pathfinding algorithm.

## Entities
The core **entities** (or models) in the system are as follows:
- **Nodes** - represent graph nodes of different types.
- **Edges** - represent weighted graph edges.
- **Shipments** - define the start and end point of a pathfinding call and any additional constraints.
- **Shipment Constraints** - modify the behaviour of the pathfinding algorithm by adding restrictions that must be followed.
- **Node Modifiers** - add additional capabilities to nodes that allows them to fulfill the constraints.

## Architectural choices
The system uses client-server model, implemented accordingly with ReactJs and ASP.NET.
The high-level architecture establishes 4 distinct layers:
- **Client** - the client application which queries the ASP.NET Web API.
- **Web API** - server-side Web layer which is responsible for managing endpoints, data parsing and calling the apropriate services.
- **Services** - hold the primary business logic of the application, request and persist data via the Data layer.
- **Data** - establish the data models, seed initial data examples and provide access via **Repository Pattern**.

The **Service** layer implements two polymorphic hierarchies - Nodes and Constraints. This allowes the pathfinding algorithm to work without any knowledge of the underlying implementations for the different types of nodes and constraints. Additionally, the use of **Factory Pattern** decouples any of the services from the two hierarchies and enables an quick and easy way to extend them without changing the logic of the pathfinding algorithm.

Another architectural choice is the use of **Composite Pattern** for the Constraints, allowing the creation of more complex types of restrictions with the help of "And" and "Or" constraints, which combine multiple sub-constraints into one and require all of them to be fulfilled or at least one accordingly.

## Notes:
The project is still in development. Most of the business logic is complete but there is room for refactoring and additional validation and exception handling.

The Web API and Client are still not complete and some of the functionality is still not exposed to access from the outside.
Due to the complexity of the Composite Pattern and it's difficult modification in the Client, it currently supports only JSON visualization and needs to be edited as text. Below is an example that it must follow:

```json
{
  "ConstraintType": "And",
  "Value": null,
  "Children": [
    {
      "ConstraintType": "MaxRisk",
      "Value": 2
    },
    {
      "ConstraintType": "MaxLength",
      "Value": 50
    }
  ]
}
```

The allowed constraint types are `"And"`, `"Or"`, `"MaxRisk"`, `"MaxLength"`, `"RequireCooling"`, `"Special"`.

Functionalities to be added in the UI:
- Field to add Node modifiers.
- Menus to create Nodes and Edges.
- Menu to create Shipments.

Future plans:
- Add **Strategy Pattern** for selection of pathfinding algorithms
- Create registration system and ability to store different graphs
- Refactor code and add additional validations
- Explore separation into microservices
- Add circuit-breaker and load balancing when hosted