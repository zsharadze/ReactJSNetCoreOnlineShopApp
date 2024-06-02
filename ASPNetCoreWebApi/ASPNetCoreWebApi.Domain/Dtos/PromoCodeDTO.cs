using ASPNetCoreWebApi.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class PromoCodeDTO
    {
        public int Id { get; set; }
        public string PromoCodeText { get; set; }
        public bool IsUsed { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Discount { get; set; }
        public string UsedByUserEmail { get; set; }
        public int? UsedOnOrderId { get; set; }
    }
}
