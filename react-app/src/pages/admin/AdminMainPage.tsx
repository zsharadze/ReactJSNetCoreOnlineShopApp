import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useLocation, useSearchParams } from "react-router-dom";
import AdminOrders from "./AdminOrders";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminPromoCodes from "./AdminPromoCodes";
import { Typography } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const AdminMain = () => {
  const [tabIndexValue, setTabIndexValue] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndexValue(newValue);
    searchParams.set("tabIndex", newValue.toString());
    setSearchParams(searchParams);
  };

  const search = useLocation().search;

  useEffect(() => {
    const tabIndex = new URLSearchParams(search).get("tabIndex");
    if (tabIndex) setTabIndexValue(Number(tabIndex));
  }, []);

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Typography variant="h5">Adminstration</Typography>
      <Box sx={{ width: "100%", paddingLeft: "16px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndexValue}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Orders" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(1)} />
            <Tab label="Categories" {...a11yProps(2)} />
            <Tab label="Promo Codes" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabIndexValue} index={0}>
          <AdminOrders />
        </CustomTabPanel>
        <CustomTabPanel value={tabIndexValue} index={1}>
          <AdminProducts />
        </CustomTabPanel>
        <CustomTabPanel value={tabIndexValue} index={2}>
          <AdminCategories />
        </CustomTabPanel>
        <CustomTabPanel value={tabIndexValue} index={3}>
          <AdminPromoCodes />
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default AdminMain;
