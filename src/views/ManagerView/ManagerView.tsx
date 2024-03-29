import { AxiosError } from "axios";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";
import { Container, Row } from "react-bootstrap";
import { useQuery, UseQueryResult } from "react-query";
import api from "../../utils/api";
import { File } from "../../interfaces/file";
import Error from "../../components/Error";
import { useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./style.css";
import MainPageButton from "../../components/MainPageButton";
import HomePageButton from "../../components/HomePageButton";
import Icon from "../../components/Icon";
import FileFrame from "../../components/FileFrame";
import Loader from "../../components/loader/loader";

const fetchManager = async (
  path: string | undefined
): Promise<File[] | File> => {
  const res = await api<File[] | File>({
    method: "get",
    url: `${path}`,
  });
  if (res.status === 200) {
    return res.data;
  }
  throw new AxiosError(`error, status: ${res.status}`);
};

const ManagerView = () => {
  const params = useParams();

  const {
    isLoading,
    isError,
    error,
    data,
  }: UseQueryResult<File[] | File, AxiosError<string, any>> = useQuery<
    File[] | File,
    AxiosError<string, any>
  >(["fileStats", params["*"]], () => fetchManager(params["*"]), {
    enabled: !!params["*"],
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  if (data && Array.isArray(data)) {
    return (
      <Container className="mt-3">
        <MainPageButton />
        <HomePageButton />
        <Row className="mt-2">
          <MDBTable responsive>
            <MDBTableHead>
              <tr>
                <th scope="col">File name</th>
                <th scope="col">Size</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {data.map((file) => (
                <tr key={file.id}>
                  <LinkContainer to={`${file.pathFile}`}>
                    <td className="file-name">
                      <small>
                        <Icon file={file} />
                      </small>{" "}
                      {file.fileName}
                    </td>
                  </LinkContainer>
                  <td>{file.size}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </Row>
      </Container>
    );
  }
  if (data && data.streamPath && !data.pathFile) {
    return <FileFrame file={data} />;
  }
  return <div>Nothing to response...</div>;
};

export default ManagerView;
