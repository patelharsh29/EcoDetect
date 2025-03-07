import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CardActionArea, CardMedia, Grid, Button, CircularProgress } from "@material-ui/core";
import logo from "./logo.png";
import image from "./bg.png";
import { DropzoneArea } from "material-ui-dropzone";
import { common } from "@material-ui/core/colors";
import axios from "axios";

const ColorButton = withStyles(() => ({
  root: {
    color: "#000",
    backgroundColor: common.white,
    "&:hover": {
      backgroundColor: "#ffffff7a",
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  root: { maxWidth: 345, flexGrow: 1 },
  media: { height: 400 },
  gridContainer: { justifyContent: "center", padding: "4em 1em 0 1em" },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%) !important",
    borderRadius: "15px",
  },
  imageCardEmpty: { height: "auto" },
  tableContainer: { backgroundColor: "transparent !important", boxShadow: "none !important" },
  tableCell: {
    fontSize: "22px",
    backgroundColor: "transparent !important",
    borderColor: "transparent !important",
    color: "#000000a6 !important",
    fontWeight: "bolder",
    padding: "1px 24px 1px 16px",
  },
  appbar: {
    background: "rgba(255, 245, 157, 0.4)",
    boxShadow: "none",
  padding: "15px 20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#689f38",
  },
  
  resultContainer: {
    backgroundColor: "transparent !important", // Semi-transparent green
    color: "white", // Ensures text is readable
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
  },

  loader: { color: "#be6a77 !important" },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      try {
        let res = await axios.post(process.env.REACT_APP_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
      setIsloading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
    // eslint-disable-next-line
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h4" noWrap style={{ marginLeft: "40px" }}>
            EcoDetect
          </Typography>
          <div className={classes.grow} />
          <Avatar src={logo} />
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid className={classes.gridContainer} container direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ""}`}>
              {image && (
                <CardActionArea>
                  <CardMedia className={classes.media} image={preview} component="img" title="Uploaded Image" />
                </CardActionArea>
              )}
              {!image && (
                <CardContent className={classes.content}>
                  <DropzoneArea acceptedFiles={["image/*"]} dropzoneText={"Drag and drop an image of a plant leaf"} onChange={onSelectFile} />
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.resultContainer}>
                  <Typography variant="h6">Detected Class: {data.class}</Typography>
                  <Typography variant="h6">Confidence: {confidence}%</Typography>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography className={classes.title} variant="h6" noWrap>
                    Processing...
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data && (
            <Grid item>
              <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData}>
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};
