import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useCookies } from 'react-cookie';
import {
  useNavigate,
} from "react-router-dom";
import { getStudents } from '../Communicator';
import { Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchField from '../SearchField';
import SearchIcon from '@material-ui/icons/Search';
import StudentTable from '../StudentTable';
import StudentFormDialog from '../StudentFormDialog';
import { Student } from '../Interfaces';

const styles = (theme: any) => ({
    container: {
        marginTop: theme.spacing(10),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column' as "column",
    },
    img: {
        width: "100%",
        maxWidth: "450px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
    },
    button: {

        height: "100%"
    }
});


/**
 *
 *
 * @export
 * @returns
 */
const StudentOverview = observer( (props: any) => {
    const {classes} = props;
    const [cookies, setCookie] = useCookies(['c_user']);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [filteredStudents, setFilteredStudents] = React.useState<Array<Student>>([])
    const navigate = useNavigate();
    

    function openDialog(test: string){
        setOpen(true);
    }

    async function fetchStudents(){
        const students = await getStudents(props.store.userStore.school);
        props.store.studentStore.setStudentList(students)
        setFilteredStudents(students)
    }
    
    useEffect(() => {
        const fetchCall = async () => {
            const students = await getStudents(props.store.userStore.school);
            props.store.studentStore.setStudentList(students)
            setFilteredStudents(students)
          }
        fetchCall()
    }, []);

    return (
      
      <div>
            <Container maxWidth="xl" className={classes.container}>
                <Paper className={classes.paper}>
                    <Grid direction="row"
                        container 
                        spacing={2}
                    >
                        <Grid item xs={4} md={3} lg={2} xl={2}>
                            <Button 
                                fullWidth
                                disableElevation
                                variant={"contained"} 
                                color={'primary'} 
                                className={classes.button}
                                startIcon={<AddIcon/>}
                                onClick={() => setOpen(true)}>
                                {props.translation.students.addStudentButtonText}
                            </Button>
                        </Grid>
                        
                        <Grid item xs={8} md={9} lg={10} xl={10}>
                            <SearchField
                                label={props.translation.students.searchFieldLabel}
                                setValue={setValue}
                                setFilteredStudents={setFilteredStudents}
                                students={props.store.studentStore.studentList}
                                value={value}
                                icon={<SearchIcon/>}
                            />
                        </Grid>
                    </Grid>
                    <div style={{paddingTop: 16}}/>
                    <StudentTable 
                        store={props.store} 
                        order={props.order} 
                        orderBy={props.orderBy} 
                        students={filteredStudents}
                        translation={props.translation}
                        />
                </Paper>
                
            </Container>
            <StudentFormDialog
                store={props.store}
                open={open}
                translation={props.translation}
                setOpen={setOpen}
                fetchStudents={fetchStudents}
            />
      </div>
    );
  });

export default withStyles(styles)(StudentOverview);