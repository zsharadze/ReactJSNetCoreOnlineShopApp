using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ASPNetCoreWebApi.Domain.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(PromoCodeText), IsUnique = true)]
    public class PromoCode
    {
        public int Id { get; set; }
        [Required]
        public string PromoCodeText { get; set; }
        public bool IsUsed { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Discount { get; set; }
        [NotMapped]
        public string UsedByUserEmail { get; set; }
        [NotMapped]
        public int? UsedOnOrderId { get; set; }
        public int? OrderId { get; set; }
        public virtual Order Order { get; set; }
    }
}
