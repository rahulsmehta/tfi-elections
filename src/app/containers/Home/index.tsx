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
  Intent
} from "@blueprintjs/core";
// import { bindActionCreators, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router';
// import { TodoActions } from 'app/actions';
import { RootState } from 'app/reducers';
import { Election } from 'app/models';
// import { TodoModel } from 'app/models';
// import { omit } from 'app/utils';

export namespace Home {
  export interface Props extends RouteComponentProps<void> {
    elections: RootState.ElectionState;
    user: string;
    // actions: TodoActions;
  }
}

@connect(
  (state: RootState, ownProps): Partial<Home.Props> => {
    const { elections, user } = state;
    return { elections, user };
  })
export class Home extends React.Component<Home.Props> {
  static defaultProps: Partial<Home.Props> = {
  };

  constructor(props: Home.Props, context?: any) {
    super(props, context);
    // this.handleClearCompleted = this.handleClearCompleted.bind(this);
    // this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  public componentDidMount() {
      console.warn("Home component mounted");
      // console.log(this.props.elections);
      // console.log(this.props.user);

      console.log(this.props.match);

  }

//   handleClearCompleted(): void {
//     const hasCompletedTodo = this.props.todos.some((todo) => todo.completed || false);
//     if (hasCompletedTodo) {
//       this.props.actions.clearCompleted();
//     }
//   }

//   handleFilterChange(filter: TodoModel.Filter): void {
//     this.props.history.push(`#${filter}`);
//   }

  private renderCurrentBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb><Icon icon={restProps.icon} /> {text}</Breadcrumb>;
  }

  private renderBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    // return <Breadcrumb><Icon icon={restProps.icon} /> {text}</Breadcrumb>;
    return <Breadcrumb><Button icon={restProps.icon} className={Classes.MINIMAL} text={text}/></Breadcrumb>;
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

  private mapStateToPriority = (state: Election.ElectionState) => {
    if (state == Election.ElectionState.ACTIVE) {
      return 2;
    } else if (state == Election.ElectionState.CLOSED) {
      return 1;
    } else {
      return 0;
    }
  }

  // private onCardSelect = () => {

  // }

  private renderCard = (election: Election) => {
    return (
      <Card interactive={true} elevation={Elevation.TWO} className={style.card} key={election.id} >
        <H3>{election.position}</H3>
        <Icon icon={election.icon} iconSize={40} />
        <Tag intent={this.mapStateToIntent(election.state)} className={style.status} > {election.state.toLocaleUpperCase()} </Tag>
      </Card>
    );
  }

  private renderCards = () => {
    const elections = this.props.elections;
    const sorted = elections.sort((a,b) => {
      const an = this.mapStateToPriority(a.state);
      const bn = this.mapStateToPriority(b.state);
      return bn - an;
    });
    return sorted.map(this.renderCard);
  }

  render() {
    // const { todos, actions, filter } = this.props;
    // const activeCount = todos.length - todos.filter((todo) => todo.completed).length;
    // const filteredTodos = filter ? todos.filter(FILTER_FUNCTIONS[filter]) : todos;
    // const completedCount = todos.reduce((count, todo) => (todo.completed ? count + 1 : count), 0);

    const adminButton = true ? (
            <Button className="bp3-minimal" icon="dashboard" text="Admin" /> 
        ) : undefined;

        const BREADCRUMBS: IBreadcrumbProps[] = [
          { href: "/", icon: "layers", text: "All Elections" },
          // { href: "/uuid-1", icon: "person", text: "President" },
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
            <Tooltip position={Position.BOTTOM_LEFT} content={"Signed in as " +this.props.user}>
              <Button className="bp3-minimal" icon="person" />
            </Tooltip>
          </Navbar.Group>
        </Navbar>
        <div className={style.container} >
          {this.renderCards()}
        </div>
      </div>
    );
  }
}
