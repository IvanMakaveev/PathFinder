namespace PathFinder.Web.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class CreateNodeModifierInputModel
    {
        [Required]
        public string ModifierType { get; set; }

        [Required]
        public int Value { get; set; }
    }
}
