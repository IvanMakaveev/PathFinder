namespace PathFinder.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;

    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Mapping;

    public abstract class Node
    {
        protected Node(int id, string name, Dictionary<NodeModifierType, int> modifiers)
        {
            this.Id = id;
            this.Name = name;
            this.Modifiers = modifiers;
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public Dictionary<NodeModifierType, int> Modifiers { get; set; }

        public abstract void ModifyContext(PathFindingContext context);
    }
}
