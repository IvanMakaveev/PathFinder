namespace PathFinder.Web.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class EditEdgeInputModel
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Length must be a positive integer.")]
        public int Length { get; set; }
    }
}
