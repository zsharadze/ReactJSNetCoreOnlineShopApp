namespace ASPNetCoreWebApi.Domain.Extensions
{
    public class Pager
    {
        public Pager(int totalItems, int? pageCurrent, int pageSize)
        {
            // calculate total, start and end pages
            var totalPages = (int)Math.Ceiling((decimal)totalItems / (decimal)pageSize);
            var currentPage = pageCurrent != null ? (int)pageCurrent : 1;
            var startPage = currentPage - 5;
            var endPage = currentPage + 4;
            if (startPage <= 0)
            {
                endPage -= (startPage - 1);
                startPage = 1;
            }
            if (endPage > totalPages)
            {
                endPage = totalPages;
                if (endPage > 10)
                {
                    startPage = endPage - 9;
                }
            }

            TotalItems = totalItems;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalPages = totalPages;
            StartPage = startPage;
            EndPage = endPage;
        }

        public string GetPaginationSummaryText(int pageIndex, int gridPagesize, int totalCount)
        {
            if (totalCount > 0)
            {
                string to = "";

                if (pageIndex * gridPagesize == 0 && ((pageIndex * gridPagesize) + gridPagesize) <= totalCount)
                {
                    to = gridPagesize.ToString();
                }
                else
                {
                    int first = ((pageIndex * gridPagesize) + 1);
                    int second = first + gridPagesize - 1;

                    if (second <= totalCount)
                        to = second.ToString();
                    else
                        to = totalCount.ToString();
                }


                return "Showing " + ((pageIndex * gridPagesize) + 1).ToString() + " to " + to + " of " + totalCount + " entries";
            }
            else
                return "Showing 0 to 0 of 0 entries";
        }

        public int TotalItems { get; private set; }
        public int CurrentPage { get; private set; }
        public int PageSize { get; private set; }
        public int TotalPages { get; private set; }
        public int StartPage { get; private set; }
        public int EndPage { get; private set; }
        public string PaginationSummary { get; set; }
    }

    public class PagerHelper
    {

        public Pager GetPager { get; private set; }
        public int CurrentPage { get; private set; }
        public int PageSize { get; private set; }
        public PagerHelper(int totalCount, int pageIndex, int pageSize, string summaryTextAdd)
        {
            Pager pager = new Pager(totalCount, pageIndex == 0 ? 1 : pageIndex, pageSize);

            int pageindexForSummary = 0;
            if (pageIndex != 0)
                pageindexForSummary = pageIndex - 1;
            pager.PaginationSummary = pager.GetPaginationSummaryText(pageindexForSummary, pageSize, totalCount) + summaryTextAdd;
            GetPager = pager;
            CurrentPage = pager.CurrentPage;
            PageSize = pager.PageSize;
        }
    }
}
