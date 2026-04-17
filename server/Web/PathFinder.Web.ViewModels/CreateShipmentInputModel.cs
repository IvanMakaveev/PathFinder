namespace PathFinder.Web.ViewModels
{
    using System.ComponentModel.DataAnnotations;

    public class CreateShipmentInputModel
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public int StartNodeId { get; set; }

        [Required]
        public int EndNodeId { get; set; }
    }
}
