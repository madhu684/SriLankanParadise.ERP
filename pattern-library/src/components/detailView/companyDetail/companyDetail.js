import React from "react";
import template from "./companyDetail.jsx";
import {
  get_companies_api,
  delete_company_api,
} from "../../../services/userManagementApi.js";

class companyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showModal: false,
      showModalInParent: false,
      showDeleteConfirmation: false,
      companyToDeleteId: null,
    };
  }

  componentDidMount() {
    this.fetchCompanies();
  }

  fetchCompanies = async () => {
    try {
      const resonse = await get_companies_api();
      const responseData = resonse.data.result;
      this.setState({ data: responseData });
    } catch (error) {
      console.error("Error fetching user compamies:", error);
      // Handle error if needed
    }
  };

  handleDeleteCompany = (companyId) => {
    this.setState({
      showDeleteConfirmation: true,
      companyToDeleteId: companyId,
    });
  };

  handleCloseDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      companyToDeleteId: null,
    });
  };

  handleConfirmDeleteCompany = async () => {
    const { companyToDeleteId } = this.state;

    if (companyToDeleteId) {
      await delete_company_api(companyToDeleteId);
      await this.fetchCompanies();
      this.handleCloseDeleteConfirmation();
    }
  };

  handleShowModal = () => {
    this.setState({ showModal: true });
    this.setState({ showModalInParent: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
    this.handleCloseModalInParent();
  };

  handleCloseModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      this.setState({ showModalInParent: false });
    }, delay);
  };

  handleCompanyAdded = async () => {
    await this.fetchCompanies();
  };

  render() {
    return template.call(this);
  }
}

export default companyDetail;
