// import yaml from 'js-yaml';
// import {
//     PERSON
// } from '../../resume/data.yml';
import axios from 'axios';
import {
    terms
} from '../terms';

// Called by templates to decrease redundancy
function getVueOptions (name, email) {
    const opt = {
        name: name,
        email: email,
        data() {
            
            return {
                person: {},
                terms: terms,
            };
        },
        mounted: function() {
            const email = this.$route.query.email;
            console.log(email);
            axios
      .post('http://localhost:5000/api/v1/get-cv', { email: email })
      .then(({ data }) => {
          this.person = data.data.PERSON;
          console.log(this.person);
      });
        },
        computed: {
            lang () {
                const defaultLang = this.terms.en;
                const useLang = this.terms['en'];

                // overwrite non-set fields with default lang
                Object.keys(defaultLang)
                    .filter(k => !useLang[k])
                    .forEach(k => {
                        console.log(k);
                        useLang[k] = defaultLang[k];
                    });

                return useLang;
            },

            contactLinks() {
                const links = {};

                if(this.person.contact.github) {
                    links.github = `https://github.com/${this.person.contact.github}`;
                }

                if(this.person.contact.codefights) {
                    links.codefights = `https://codefights.com/profile/${this.person.contact.codefights}`;
                }

                if(this.person.contact.medium) {
                    links.medium = `https://medium.com/@${this.person.contact.medium}`;
                }

                if(this.person.contact.email) {
                    links.email = `mailto:${this.person.contact.email}`;
                }

                if(this.person.contact.linkedin) {
                    links.linkedin = `https://linkedin.com/in/${this.person.contact.linkedin}`;
                }

                if(this.person.contact.phone) {
                    links.phone = `tel:${this.person.contact.phone}`;
                }

                return links;
            },
        }
    };
    return opt;
}

export {
    getVueOptions
};
