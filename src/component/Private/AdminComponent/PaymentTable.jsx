import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const PaymentTable = () => {
  const payments = [
    {
      id: 1,
      userName: "Johan Dae",
      userType: "Agent",
      dateTime: "12.09.2019 - 12.53 PM",
      type: "Elite Plan",
      amount: "$34,295",
      status: "Failed"
    },
    {
      id: 2,
      userName: "Devil Slay",
      userType: "Agent",
      dateTime: "12.09.2019 - 12.53 PM",
      type: "Document",
      amount: "$34,295",
      status: "Pending"
    },
    {
      id: 3,
      userName: "Johan Dae",
      userType: "Agent",
      dateTime: "12.09.2019 - 12.53 PM",
      type: "Elite Plan",
      amount: "$34,295",
      status: "Failed"
    },
    {
      id: 4,
      userName: "Devil Slay",
      userType: "Agent",
      dateTime: "12.09.2019 - 12.53 PM",
      type: "Document",
      amount: "$34,295",
      status: "Pending"
    },
    {
      id: 5,
      userName: "Devil Slay",
      userType: "Agent",
      dateTime: "12.09.2019 - 12.53 PM",
      type: "Document",
      amount: "$34,295",
      status: "Pending"
    }
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Pending & Failed Payments
        </Typography>
        <Typography 
          component="button"
          sx={{ 
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { color: 'primary.dark' }
          }}
        >
          View All
        </Typography>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Date - Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src="/api/placeholder/40/40"
                      alt={payment.userName}
                    />
                    <Typography sx={{ fontWeight: 500 }}>
                      {payment.userName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{payment.userType}</TableCell>
                <TableCell>{payment.dateTime}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{payment.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={payment.status === 'Failed' ? 'error' : 'warning'}
                    sx={{
                      borderRadius: '16px',
                      color: payment.status === 'Failed' ? '#dc2626' : '#b45309',
                      bgcolor: payment.status === 'Failed' ? '#fee2e2' : '#fef3c7',
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="default">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PaymentTable;