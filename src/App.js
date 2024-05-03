import React, { useState, useEffect } from 'react';
import {Container, Typography, TextField, Grid, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import JobCard from './JobCard';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [jobListings, setJobListings] = useState([]);
    const [minExperience, setMinExperience] = useState('');
    const [filteredJobListings, setFilteredJobListings] = useState([]);
    const [minBasePay, setMinBasePay] = useState('');
    const [remoteOption, setRemoteOption] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        const fetchJobListings = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                const body = JSON.stringify({ "limit": 100, "offset": 0 });
                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body
                };
                const response = await fetch("https://api.weekday.technology/adhoc/getSampleJdJSON", requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch job listings');
                }
                const data = await response.json();

                setJobListings(data.jdList);
            } catch (error) {
                console.error(error);
            }
        };

        fetchJobListings();
    }, []);


    useEffect(() => {

      // Filter job listings based on minExp
      const filteredListingsByExperience = jobListings.filter(job => {
          if (!minExperience) return true; // Return all listings if no min experience selected
          return job.minExp >= minExperience;
      });

      // Filter job listings based on minimum base pay
      const filteredListingsByBasePay = filteredListingsByExperience.filter(job => {
        if (!minBasePay) return true; // Return all listings if no min base pay selected
        return job.minJdSalary >= minBasePay; 
      });


      // Filter job listings based on search term
      const filteredListingsBySearchTerm = filteredListingsByBasePay.filter(job =>
        job.companyName.toLowerCase().includes(searchTerm) ||
        job.jobRole.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
      );

      // Filter job listings based on remote/on-site option
      const filteredListingsByRemoteOption = filteredListingsBySearchTerm.filter(job => {
        if (!remoteOption) return true; // Return all listings if no remote option selected
        return job.location === remoteOption;
      });

      // Filter job listings based on Role
      const filteredListingsByRole = filteredListingsByRemoteOption.filter(job => {
        if (!roleFilter) return true; // Return all listings if no role selected
        return job.jobRole === roleFilter;
      });

      setFilteredJobListings(filteredListingsByRole);
  }, [jobListings, minExperience, searchTerm, minBasePay, remoteOption, roleFilter]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleMinExperienceChange = (event) => {
      setMinExperience(event.target.value);
    };

    const handleMinBasePayChange = (event) => {
      setMinBasePay(event.target.value);
    };

    const handleRemoteOptionChange = (event) => {
      setRemoteOption(event.target.value);
    };

    const handleRoleFilterChange = (event) => {
      setRoleFilter(event.target.value);
    }

    return (
        <Container maxWidth="xxl">
            <Typography variant="h4" align="center" gutterBottom>
                Job Listings
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Search jobs..."
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="min-experience-label">Min Experience</InputLabel>
                        <Select
                            labelId="min-experience-label"
                            id="min-experience-select"
                            value={minExperience}
                            onChange={handleMinExperienceChange}
                            label="Min Experience"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(year => (
                                <MenuItem key={year} value={year}>{year === 10 ? '10+ years' : `${year} year${year !== 1 ? 's' : ''}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="min-base-pay-label">Min Base Pay</InputLabel>
                        <Select
                            labelId="min-base-pay-label"
                            id="min-base-pay-select"
                            value={minBasePay}
                            onChange={handleMinBasePayChange}
                            label="Min Base Pay"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {[0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000].map(amount => (
                                <MenuItem key={amount} value={amount}>${amount.toLocaleString()}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="remote-option-label">Remote Option</InputLabel>
                        <Select
                            labelId="remote-option-label"
                            id="remote-option-select"
                            value={remoteOption}
                            onChange={handleRemoteOptionChange}
                            label="Remote Option"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="remote">Remote</MenuItem>
                            <MenuItem value="onsite">On-site</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="role-filter-label">Role</InputLabel>
                        <Select
                            labelId="role-filter-label"
                            id="role-filter-select"
                            value={roleFilter}
                            onChange={handleRoleFilterChange}
                            label="Role"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data', 'Design', 'Quality Assurance', 'Management', 'Marketing', 'Sales', 'Customer Support'].map(role => (
                                <MenuItem key={role} value={role.toLowerCase()}>{role}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                {filteredJobListings.map(job => (
                    <Grid item xs={12} sm={6} md={4} key={job.jdUid}>
                        <JobCard job={job} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default App;
