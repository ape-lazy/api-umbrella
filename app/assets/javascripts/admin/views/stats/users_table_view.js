Admin.StatsUsersTableView = Ember.View.extend({
  tagName: 'table',

  classNames: ['table', 'table-striped', 'table-bordered', 'table-condensed'],

  didInsertElement: function() {
    this.$().DataTable({
      searching: false,
      serverSide: true,
      ajax: {
        url: '/admin/stats/users.json',
        data: _.bind(function(data) {
          var query = this.get('controller.query.params');
          return _.extend({}, query, data, {
            search: query.search,
            start_time: query.start,
            end_time: query.end,
          });
        }, this)
      },
      order: [[4, 'desc']],
      columns: [
        {
          data: 'email',
          title: 'Email',
          defaultContent: '-',
          render: _.bind(function(email, type, data) {
            if(type === 'display' && email && email !== '-') {
              var params = _.clone(this.get('controller.query.params'));
              params.search = 'user_id:"' + data.id + '"';
              var link = '#/stats/logs/' + $.param(params);

              return '<a href="' + link + '">' + _.escape(email) + '</a>';
            }

            return email;
          }, this),
        },
        {
          data: 'first_name',
          title: 'First Name',
          defaultContent: '-',
        },
        {
          data: 'last_name',
          title: 'Last Name',
          defaultContent: '-',
        },
        {
          data: 'created_at',
          type: 'date',
          title: 'Signed Up',
          defaultContent: '-',
          render: function(time, type) {
            if(type === 'display' && time && time !== '-') {
              return moment(time).format('YYYY-MM-DD HH:mm:ss');
            }
          },
        },
        {
          data: 'hits',
          title: 'Hits',
          defaultContent: '-',
          render: function(number, type) {
            if(type === 'display' && number && number !== '-') {
              return numeral(number).format('0,0');
            }

            return number;
          },
        },
        {
          data: 'last_request_at',
          type: 'date',
          title: 'Last Request',
          defaultContent: '-',
          render: function(time, type) {
            if(type === 'display' && time && time !== '-') {
              return moment(time).format('YYYY-MM-DD HH:mm:ss');
            }

            return time;
          },
        },
        {
          data: 'use_description',
          title: 'Use Description',
          defaultContent: '-',
        },
      ]
    });
  },

  refreshData: function() {
    this.$().DataTable().draw();
  }.observes('controller.query.params.search', 'controller.query.params.start', 'controller.query.params.end'),
});
