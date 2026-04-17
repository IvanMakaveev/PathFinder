namespace PathFinder.Web.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class CreateNodeInputModel
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string NodeType { get; set; }
    }
}
