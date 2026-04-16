namespace PathFinder.Services.Data
{
    using System.Collections.Generic;

    using PathFinder.Data.Models.Enums;

    public class ConstraintDto
    {
        public ConstraintType ConstraintType { get; set; }

        public int? Value { get; set; }

        public ICollection<ConstraintDto> Children { get; set; } = new List<ConstraintDto>();
    }
}
