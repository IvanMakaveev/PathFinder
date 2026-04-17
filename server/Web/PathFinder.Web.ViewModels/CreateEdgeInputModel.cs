namespace PathFinder.Web.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class CreateEdgeInputModel
    {
        [Required]
        public int FromNodeId { get; set; }

        [Required]
        public int ToNodeId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Length must be a positive integer.")]
        public int Length { get; set; }
    }
}
