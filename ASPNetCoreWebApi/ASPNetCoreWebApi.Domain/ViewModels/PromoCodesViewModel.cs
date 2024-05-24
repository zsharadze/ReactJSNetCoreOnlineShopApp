using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class PromoCodesViewModel
    {
        public List<PromoCode> PromoCodeList { get; set; }
        public Pager Pager { get; set; }
    }
}
