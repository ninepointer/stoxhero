import React,{useState} from 'react';
import MDBox from '../../../components/MDBox';
import MDTypography from '../../../components/MDTypography';

const ContactInfoCard = ({ contactInfo }) => {
    const [expanded, setExpanded] = useState(false);
  
    const handleReadMoreClick = () => {
      setExpanded(!expanded);
    }
  
    const getMessage = () => {
      if (!expanded && contactInfo.message.length > 300) {
        return contactInfo.message.substring(0, 300) + "... ";
      } else {
        return contactInfo.message;
      }
    }
  
    return (
      <MDBox style={{ marginBottom: '12px', padding:'12px', maxHeight: expanded ? 'none' : '250px', overflow: 'hidden', border: '1px solid black', borderRadius: '8px' }}>
        <MDTypography style={{ wordWrap: 'break-word', fontSize:'14px' }}>Name: {contactInfo.first_name} {contactInfo.last_name}</MDTypography>
        <MDTypography style={{fontSize:'14px'}}>Email: {contactInfo.email}</MDTypography>
        <MDTypography style={{fontSize:'14px'}}>Phone: {contactInfo.phone}</MDTypography>
        <MDTypography style={{fontSize:'14px'}}>Message: {getMessage()}
          {contactInfo.message.length > 500 && (
              <span style={{color: 'grey', cursor: 'pointer', fontSize:'14px'}} onClick={handleReadMoreClick}>
              Read {expanded ? 'less' : 'more'}
            </span>
          )}
        </MDTypography>
        <MDTypography style={{fontSize:'14px'}}>Messaged On: {new Date(contactInfo.createdOn).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} {(new Date(contactInfo.createdOn).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata',hour12: true, timeStyle: 'medium' }).toUpperCase())}</MDTypography>
      </MDBox>
    );
  }
  

export default ContactInfoCard