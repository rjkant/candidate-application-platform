import React, {useState} from 'react';
import {Card, CardContent, Typography, Button, CardMedia} from '@mui/material';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
        marginTop: 16,
    },
    media: {
        width: 62,
        height: 70,
        marginRight: 16,
        marginLeft: 8,
        marginTop: 4,
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
    },
    companyDetails: {
        marginTop: -10,
    },
    aboutCompany: {
        marginTop: 12,
    },
}));

function JobCard({ job }) {
    const classes = useStyles();
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <Card variant="outlined" className={classes.root}>
            <div className={classes.details}>
                <CardMedia
                    component="img"
                    className={classes.media}
                    image={job.logoUrl}
                    alt={job.company}
                />
                <CardContent className={classes.companyDetails}>
                    <Typography color={'blue'}>
                        {job.companyName}
                    </Typography>
                    <Typography color={'grey'}>
                        {job.jobRole}
                    </Typography>
                    <Typography color='black'>
                        {job.location}
                    </Typography>
                </CardContent>
            </div>
            <div>
                <CardContent>
                    <div>
                        Estimated Salary: {job.salaryCurrencyCode + ' '}
                        {job.minJdSalary ? job.minJdSalary : 0}
                            - {job.maxJdSalary} 
                    </div>
                    <div className={classes.aboutCompany}>
                        About Company:
                        <div> About us </div>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.description}>
                            {showFullDescription ? job.jobDetailsFromCompany : job.jobDetailsFromCompany.slice(0, 300)}
                            {job.jobDetailsFromCompany.length > 300 && !showFullDescription && (
                                <Button color="primary" onClick={toggleDescription}>
                                    View More
                                </Button>
                            )}
                    </Typography>
                    </div>
                    <div>
                        {job.minExp !== null ? 'Minimum Experience' : ''}
                        <Typography>{job?.minExp}</Typography>
                    </div>
                    <Button variant="contained" color="primary">
                        Apply
                    </Button>
                </CardContent>
            </div>
        </Card>
    );
}

export default JobCard;
