import React from "react";
import template from "./companyDetail.jsx";
import {
  get_companies_api,
  delete_company_api,
} from "common/services/userManagementApi.js";

class companyDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showAddCompanyModal: false,
      showAddCompanyModalInParent: false,
      showUpdateCompanyModal: false,
      showUpdateCompanyModalInParent: false,
      showDeleteConfirmation: false,
      companyToDeleteId: null,
      companyToUpdateId: null,
      companyToUpdateData: null,
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

  handleShowAddCompanyModal = () => {
    this.setState({ showAddCompanyModal: true });
    this.setState({ showAddCompanyModalInParent: true });
  };

  handleCloseAddCompanyModal = () => {
    this.setState({ showAddCompanyModal: false });
    this.handleCloseAddCompanyModalInParent();
  };

  handleCloseAddCompanyModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      this.setState({ showAddCompanyModalInParent: false });
    }, delay);
  };

  handleCompanyAdded = async () => {
    await this.fetchCompanies();
  };

  handleCompanyUpdated = async () => {
    await this.fetchCompanies();
  };

  handleUpdateCompany = (companyId) => {
    this.handleShowUpdateCompanyModal();

    const companyToUpdate = this.state.data.find(
      (company) => company.companyId === companyId
    );

    this.setState({
      companyToUpdateId: companyId,
      companyToUpdateData: companyToUpdate,
    });
  };

  handleShowUpdateCompanyModal = () => {
    this.setState({ showUpdateCompanyModal: true });
    this.setState({ showUpdateCompanyModalInParent: true });
  };

  handleCloseUpdateCompanyModal = () => {
    this.setState({ showUpdateCompanyModal: false });
    this.handleCloseUpdateCompanyModalInParent();
  };

  handleCloseUpdateCompanyModalInParent = () => {
    const delay = 300;
    setTimeout(() => {
      this.setState({ showUpdateCompanyModalInParent: false });
    }, delay);
  };

  render() {
    return template.call(this);
  }
}

export default companyDetail;














