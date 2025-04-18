import { Spec } from 'vega';

export const spec: Spec = {
  $schema: 'https://vega.github.io/schema/vega/v6.json',
  padding: 5,
  autosize: 'pad',

  signals: [
    {
      name: 'plotSize',
      value: 200
    }
  ],

  data: [
    {
      name: 'movies',
      url: 'data/movies.json',
      transform: [
        {
          type: 'filter',
          expr: "datum['Rotten Tomatoes Rating'] != null && datum['IMDB Rating'] != null"
        }
      ]
    },
    {
      name: 'methods',
      values: ['linear', 'log', 'exp', 'pow', 'quad', 'poly']
    },
    {
      name: 'bandwidths',
      values: [0.05, 0.3]
    }
  ],

  scales: [
    {
      name: 'x',
      type: 'linear',
      domain: { data: 'movies', field: 'Rotten Tomatoes Rating' },
      range: [0, { signal: 'plotSize' }]
    },
    {
      name: 'y',
      type: 'linear',
      domain: { data: 'movies', field: 'IMDB Rating' },
      range: [{ signal: 'plotSize' }, 0]
    }
  ],

  layout: {
    columns: 4,
    padding: 5
  },

  marks: [
    {
      type: 'group',
      from: { data: 'methods' },

      data: [
        {
          name: 'fit',
          source: 'movies',
          transform: [
            {
              type: 'regression',
              method: { signal: 'parent.data' },
              x: 'Rotten Tomatoes Rating',
              y: 'IMDB Rating',
              as: ['u', 'v']
            }
          ]
        }
      ],
      title: {
        text: { signal: 'parent.data' }
      },
      marks: [
        {
          type: 'symbol',
          from: { data: 'movies' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'Rotten Tomatoes Rating' },
              y: { scale: 'y', field: 'IMDB Rating' },
              fillOpacity: { value: 0.5 },
              size: { value: 4 }
            }
          }
        },
        {
          type: 'line',
          from: { data: 'fit' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'u' },
              y: { scale: 'y', field: 'v' },
              stroke: { value: 'firebrick' }
            }
          }
        }
      ]
    },
    {
      type: 'group',
      from: { data: 'bandwidths' },

      data: [
        {
          name: 'fit',
          source: 'movies',
          transform: [
            {
              type: 'loess',
              bandwidth: { signal: 'parent.data' },
              x: 'Rotten Tomatoes Rating',
              y: 'IMDB Rating',
              as: ['u', 'v']
            }
          ]
        }
      ],
      title: {
        text: { signal: "'loess, bandwidth ' + parent.data" }
      },
      marks: [
        {
          type: 'symbol',
          from: { data: 'movies' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'Rotten Tomatoes Rating' },
              y: { scale: 'y', field: 'IMDB Rating' },
              fillOpacity: { value: 0.5 },
              size: { value: 4 }
            }
          }
        },
        {
          type: 'line',
          from: { data: 'fit' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'u' },
              y: { scale: 'y', field: 'v' },
              stroke: { value: 'firebrick' }
            }
          }
        }
      ]
    }
  ]
};
