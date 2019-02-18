import * as React from 'react';
import * as style from './style.css';
import { connect } from 'react-redux';
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
import { RootState } from 'app/reducers';
import { Election } from 'app/models';
import { Admin } from '../Admin';

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    elections: RootState.ElectionState;
    user: string;
    // actions: TodoActions;
  }

  export interface State {
    isAdmin: boolean | undefined;
    username: string | undefined;
    isAdminOpen: boolean;
  }
}

export interface IRouteParams {
  userToken: string;
}

export interface IAdminResponse {
  isAdmin: boolean;
  username: string;
}

@connect(
  (state: RootState, ownProps): Partial<Home.Props> => {
    const { elections, user } = state;
    return { elections, user };
  })
export class Home extends React.Component<Home.Props> {
  static defaultProps: Partial<Home.Props> = {
  };

  public state: Home.State = {
    isAdmin: undefined,
    username: undefined,
    isAdminOpen: false
  }

  constructor(props: Home.Props, context?: any) {
    super(props, context);
  }

  public componentDidMount() {
      console.warn("Home component mounted");
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      console.log(routeParams)
      this.isAdmin();
  }

  public async isAdmin() {
      const routeParams = (this.props.match.params as unknown) as IRouteParams;
      const resp = await fetch(`http://localhost:3001/api/users/${routeParams.userToken}`).then((response) => response.json()) as IAdminResponse;
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
      return Intent.SUCCESS;
    } else if (state == Election.ElectionState.CLOSED) {
      return Intent.WARNING;
    } else {
      return Intent.DANGER;
    }
  }

  private renderCard = (election: Election) => {
    const routeParams = (this.props.match.params as unknown) as IRouteParams;
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
        <Tag intent={this.mapStateToIntent(election.state)} className={style.status} > {election.state.toLocaleUpperCase()} </Tag>
      </Card>
    );
  }

  private renderCards = (state: Election.ElectionState) => {
    const elections = this.props.elections;
    return elections.filter(e => e.state == state).map(this.renderCard);
  }

  private handleOpen = () => this.setState({ isAdminOpen: true });
  private handleClose = () => this.setState({ isAdminOpen: false });

  render() {
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

    return (
      <div className={style.appContainer}>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <img className={style.icon} src="../../assets/tfi-logo-large.jpg" />
            <Navbar.Heading>TFI Elections Portal</Navbar.Heading>
            <Navbar.Divider />
            { breadcrumbs }
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            {adminButton}
            <Tooltip position={Position.BOTTOM_LEFT} content={"Signed in as " +this.state.username}>
              <Button className="bp3-minimal" icon="person" />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        <div className={style.container} >
          {this.renderCards(Election.ElectionState.ACTIVE)}
        </div>
        <div className={style.container} >
          {this.renderCards(Election.ElectionState.CLOSED)}
        </div>
        <div className={style.container} >
          {this.renderCards(Election.ElectionState.COMPLETED)}
        </div>
        <Drawer
          icon="dashboard"
          onClose={this.handleClose}
          title={"Administer Elections"}
          isOpen={this.state.isAdminOpen}
        >
          <Admin />
        </Drawer>
      </div>
    );
  }
}
