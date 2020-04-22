import React, {Component} from "react";
import {getPackages, putPackage} from "../../../api/dataApi";
import styles from "./Packages.module.scss";
import {Page} from "../pages.constants";
import v4 from "uuid/dist/esm-browser/v4";

const Package = (props) => {
    const {data: {id, name}, goToPackage} = props;
    return (
        <div className={styles.package} onClick={goToPackage}>
            <div className={styles.icon}/>
            <div className={styles.data}>{name}</div>
        </div>
    );
};

class Packages extends Component {
    state = {
        packages: [{id: "id", name: "Empty test package"}]
    };

    componentDidMount() {
        getPackages().then((packages) => {
            // console.log(packages);
            this.setState({packages});
        });
    }

    goToPackage = (id) => {
        this.props.history.push(`${Page.main_editor}/${id}`)
    };

    createNewPackage = () => {
        const {packages} = this.state;
        const newPackage = {id: v4(), name: `My package #${packages.length + 1}`};
        putPackage(newPackage.id, {name: newPackage.name}).then(response => {
            this.setState(ps => {
                    return {
                        packages: ps.packages.concat(newPackage)
                    };
                }, () => this.goToPackage(newPackage.id)
            );
        })
    };

    render() {
        const {packages} = this.state;
        return (
            <div className={styles.wrapper}>
                {
                    packages.map(pack => {
                        const {id} = pack;
                        return <Package key={id}
                                        data={pack}
                                        goToPackage={() => this.goToPackage(id)}
                        />
                    })
                }
                <div onClick={this.createNewPackage}>create new</div>
            </div>
        );
    }
}

export default Packages;
