import * as React from 'react';
import * as style from './style.css';
import { 
  Navbar,
  Button,
  Alignment,
  Breadcrumb,
  Breadcrumbs,
  IBreadcrumbProps,
  Icon,
  Classes,
  H3,
  Tooltip,
  Position,
  Card,
  Elevation,
  Tag,
  Intent,
  Drawer
} from "@blueprintjs/core";
import { RouteComponentProps } from 'react-router';
// import { RootState } from 'app/reducers';
import { Election } from 'app/models';
import { Admin } from '../Admin';
import { TI_LOGO, API_BASE } from "app/utils";

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    // elections: RootState.ElectionState;
  }

  export interface State {
    isAdmin: boolean | undefined;
    username: string | undefined;
    isAdminOpen: boolean;
    elections: Election[];
  }
}

export interface IRouteParams {
  userToken: string;
}

export interface IAdminResponse {
  isAdmin: boolean;
  username: string | undefined;
}

export class Home extends React.Component<Home.Props, Home.State> {
  static defaultProps: Partial<Home.Props> = {
  };

  public state: Home.State = {
    isAdmin: undefined,
    username: undefined,
    isAdminOpen: false,
    elections: []
  }

  constructor(props: Home.Props, context?: any) {
    super(props, context);
  }

  public componentDidMount() {
      console.warn("Home component mounted");
      this.isAdmin();
      this.loadElections()
  }

  private async loadElections() {
    const resp = await fetch(`${API_BASE}/election/all`).then((value) => value.json()) as string[];
    const elections: Election[] = resp.map(r => JSON.parse(r));
    this.setState({ elections })
  }

  private async isAdmin() {
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      const resp = await fetch(`${API_BASE}/users/${routeParams.userToken}`).then((response) => response.json()) as IAdminResponse;
      this.setState({
        isAdmin: resp.isAdmin,
        username: resp.username
      });
  }


  private renderCurrentBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb><Icon icon={restProps.icon} /> {text}</Breadcrumb>;
  }

  private renderBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb><Button icon={restProps.icon} className={Classes.MINIMAL} text={text} onClick={() => {
      if (restProps.href) {
        window.location.href = restProps.href;
      }
    }}/></Breadcrumb>;
  }

  private mapStateToIntent = (state: Election.ElectionState) => {
    if (state == Election.ElectionState.ACTIVE) {
      return Intent.PRIMARY;
    } else if (state == Election.ElectionState.CLOSED) {
      return Intent.WARNING;
    } else {
      return Intent.SUCCESS;
    }
  }

  private renderCard = (election: Election) => {
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
    const roundText = election.round >= 1 ? `(Round ${election.round})` : "";
    return (
      <Card
        interactive={true}
        elevation={Elevation.TWO}
        className={style.card}
        onClick={() => {
          window.location.href = `${routeParams.userToken.replace('//','/')}/election/${election.id}`
        }}
        key={election.id}
      >
        <H3>{election.position}</H3>
        <Icon icon={election.icon} iconSize={40} />
        <Tag intent={this.mapStateToIntent(election.state)} className={style.status} > 
          {election.state.toLocaleUpperCase()} {roundText}
        </Tag>
      </Card>
    );
  }

  private renderCards = (state: Election.ElectionState) => {
    const elections = this.state.elections;
    return elections.filter(e => e.state == state).map(this.renderCard);
  }

  private handleOpen = () => this.setState({ isAdminOpen: true });
  private handleClose = () => this.setState({ isAdminOpen: false });

  render() {
    const { elections, username } = this.state;
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
    const adminButton = this.state.isAdmin ? (
            <Button className="bp3-minimal" icon="dashboard" text="Admin" onClick={this.handleOpen} /> 
        ) : undefined;

        const BREADCRUMBS: IBreadcrumbProps[] = [
          { href: `/${routeParams.userToken}`, icon: "layers", text: "All Elections" },
      ];

    const breadcrumbs = (
          <Breadcrumbs
              currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
              breadcrumbRenderer={this.renderBreadcrumb}
              items={BREADCRUMBS}
          />
      );

    const cards = elections.length > 0 ? (
        <div>
          <div className={style.container} >
            {this.renderCards(Election.ElectionState.ACTIVE)}
          </div>
          <div className={style.container} >
            {this.renderCards(Election.ElectionState.CLOSED)}
          </div>
          <div className={style.container} >
            {this.renderCards(Election.ElectionState.COMPLETED)}
          </div>
        </div>
    ) : undefined;

    const pageBody = this.state.username ? 
      <div>
        { cards }
        <Drawer
          icon="dashboard"
          onClose={this.handleClose}
          title={"Administer Elections"}
          isOpen={this.state.isAdminOpen}
        >
          <Admin adminToken={routeParams.userToken} elections={this.state.elections} {...this.props} />
        </Drawer>
      </div> : <div style={{ padding: "50px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <H3>You are not authenticated!</H3>
        <p>Please confirm that your user token is correct and try again.</p>
      </div>;


    return (
      <div className={style.appContainer}>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <img className={style.icon} src={TI_LOGO} />
            <Navbar.Heading>TFI Elections 2021</Navbar.Heading>
            <Navbar.Divider />
            { breadcrumbs }
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            {adminButton}
            <Tooltip position={Position.BOTTOM_LEFT} content={"Signed in as " + username} disabled={!username}>
              <Button className="bp3-minimal" icon="person" />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        { pageBody }
      </div>
    );
  }
}
