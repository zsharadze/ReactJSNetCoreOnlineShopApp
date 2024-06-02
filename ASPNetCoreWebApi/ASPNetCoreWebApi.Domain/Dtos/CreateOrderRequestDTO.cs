using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CreateOrderRequestDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
