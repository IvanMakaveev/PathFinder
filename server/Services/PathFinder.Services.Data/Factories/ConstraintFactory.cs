namespace PathFinder.Services.Data.Factories
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using PathFinder.Data.Models;
    using PathFinder.Data.Models.Enums;
    using PathFinder.Services.Data.Constraints;

    public static class ConstraintFactory
    {
        public static ShipmentConstraint BuildConstraintTree(IList<ShipmentConstraintModel> constraints)
        {
            if (constraints == null || constraints.Count == 0)
            {
                throw new ArgumentException("Constraints collection cannot be null or empty.");
            }

            var constraintById = constraints.ToDictionary(c => c.Id, c => BuildConstraint(c));

            var childrenByParentId = constraints
                .Where(c => c.ParentId.HasValue)
                .GroupBy(c => c.ParentId.Value)
                .ToDictionary(g => g.Key, g => g.ToList());

            var roots = constraints.Where(c => c.ParentId == null).ToList();
            if (roots.Count != 1)
            {
                throw new InvalidOperationException("Constraint tree must contain exactly one root.");
            }

            var rootModel = roots.Single();

            AttachChildren(rootModel.Id, constraintById, childrenByParentId);

            return constraintById[rootModel.Id];
        }

        private static ShipmentConstraint BuildConstraint(ShipmentConstraintModel model)
        {
            switch (model.ConstraintType)
            {
                case ConstraintType.RequireCooling:
                    return new CoolingConstraint { Id = model.Id, Value = model.Value ?? 0 };
                case ConstraintType.MaxRisk:
                    return new MaxRiskConstraint { Id = model.Id, Value = model.Value ?? 0 };
                case ConstraintType.MaxLength:
                    return new MaxLengthConstraint { Id = model.Id, Value = model.Value ?? 0 };
                case ConstraintType.And:
                    return new AndConstraint { Id = model.Id, Constraints = new List<ShipmentConstraint>() };
                case ConstraintType.Or:
                    return new OrConstraint { Id = model.Id, Constraints = new List<ShipmentConstraint>() };
                default:
                    throw new ArgumentException("Unsupported constraint type.");
            }
        }

        private static void AttachChildren(
            int parentId,
            IDictionary<int, ShipmentConstraint> constraintById,
            IDictionary<int, List<ShipmentConstraintModel>> childrenByParentId)
        {
            if (!childrenByParentId.TryGetValue(parentId, out var childModels))
            {
                return;
            }

            var parentConstraint = constraintById[parentId];

            if (parentConstraint is not CompositeConstraint)
            {
                throw new InvalidOperationException($"Constraint {parentId} has children but is not a composite constraint.");
            }

            foreach (var childModel in childModels)
            {
                var childConstraint = constraintById[childModel.Id];

                ((CompositeConstraint)parentConstraint).Constraints.Add(childConstraint);

                AttachChildren(childModel.Id, constraintById, childrenByParentId);
            }
        }
    }
}
