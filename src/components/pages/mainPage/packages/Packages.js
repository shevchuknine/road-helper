import React, {Component} from "react";
import {getPackages, putPackage, removePackage} from "../../../../api/dataApi";
import styles from "./Packages.module.scss";
import generateShortId from "../../../../helpers/shortId";
import {buildStaticImageOfMap} from "../../../../api/mapApi";
import IconCross from "../../../icons/IconCross";
import Popup from "../../../popups/popup/Popup";
import InformationPopup from "../../../popups/informationPopup/InformationPopup";

const getRandomInRange = (from, to) => {
    return (Math.random() * (to - from) + from).toFixed(4) * 1;
}

const generateRandomCoords = () => {
    const lon = getRandomInRange(-180, 180);
    const lat = getRandomInRange(-85, 85);

    return {lon, lat};
};

/*
* imgSrc ссылка на статическую картинку с изображением "местности".
* основная задача тут была потестить эту функциональность карты (генерации картинки, а не загрузка карты)
* сейчас использует рандомные координаты, в будущем должно работать с центральными координатами региона,
* на котором юзер строит маршрут.
* */
class Package extends Component {
    imgSrc = buildStaticImageOfMap(generateRandomCoords());

    removePackage = (e) => {
        e.stopPropagation();
        this.props.removePackage();
    };

    render() {
        const {data: {id, name}, goToPackage} = this.props;
        return (
            <div className={styles.package} onClick={goToPackage}>
                <div className={styles.remove} onClick={this.removePackage}><IconCross/></div>
                <div className={styles.icon}>
                    <img src={this.imgSrc}/>
                </div>
                <div className={styles.data}>{name}</div>
            </div>
        );
    }
};

/*
* Страница пакетов, которая отображает наборы маршрутов, точек и т.д.
* */
class Packages extends Component {
    state = {
        packages: []
    };

    componentDidMount() {
        getPackages().then((packages) => {
            this.setState({packages});
        });
    }

    goToPackage = (id) => () => {
        this.props.history.push(`/main/package/${id}`)
    };

    createNewPackage = () => {
        const {packages} = this.state;
        const newPackage = {id: generateShortId(), name: `My package #${packages.length + 1}`};
        putPackage(newPackage.id, {name: newPackage.name}).then(response => {
            this.setState(ps => {
                    return {
                        packages: ps.packages.concat(newPackage)
                    };
                }, this.goToPackage(newPackage.id)
            );
        })
    };

    removePackage = (id) => () => {
        removePackage(id).then(() => {
            this.setState(ps => {
                return {
                    packages: ps.packages.filter(pack => pack.id !== id)
                };
            })
        });
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
                                        goToPackage={this.goToPackage(id)}
                                        removePackage={this.removePackage(id)}
                        />
                    })
                }
                {
                    packages.length < 10 && <div onClick={this.createNewPackage}>create new</div>
                }
            </div>
        );
    }
}

export default Packages;
