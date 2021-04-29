package kr.nerv.antop.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import kr.nerv.antop.dao.GridDao;
import kr.nerv.antop.dao.ScoreDao;
import kr.nerv.antop.model.GridModel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcDaoSupport;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class GridDaoImpl extends NamedParameterJdbcDaoSupport implements GridDao {
	@Autowired
	public GridDaoImpl(DataSource ds) {
		setDataSource(ds);
	}

	// row mapper instance
	private RowMapper<GridModel> rowMapper = new SudokuRowMapper();

	public int create(GridModel sudoku) throws Exception {
		// query
		String sql = "insert into " + GridDao.TABLE_NAME + " (" + Columns.GRID + ") values (:grid)";
		// parameter
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(sudoku);
		// key holder
		KeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		// execute query
		getNamedParameterJdbcTemplate().update(sql, params, generatedKeyHolder);
		// auto increment
		return generatedKeyHolder.getKey().intValue();
	}

	public List<GridModel> find(Map<String, Object> map) throws Exception {
		// query
		String sql = "select ";
		sql += " g.seq, g.grid, g.created, g.modified, ";
		sql += " s.cost ";
		sql += " from " + GridDao.TABLE_NAME + " g ";
		sql += " left join (SELECT " + ScoreDao.Columns.GRID_SEQ + ", min(" + ScoreDao.Columns.COST + ") as cost FROM "
				+ ScoreDao.TABLE_NAME + " group by " + ScoreDao.Columns.GRID_SEQ + ") s ";
		sql += " on g." + Columns.SEQ + " = s." + ScoreDao.Columns.GRID_SEQ;
		// order
		Object sort = map.get("sort");
		Object dir = map.get("dir");
		if (sort == null) {
			sql += " order by " + Columns.SEQ + " asc";
		} else {
			sql += " order by " + sort + " " + dir;
		}
		// paging
		sql += " limit :start, :limit";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource(map);
		// execute query
		return getNamedParameterJdbcTemplate().query(sql, params, rowMapper);
	}

	public GridModel findById(int seq) throws Exception {
		// query
		String sql = "select * from " + GridDao.TABLE_NAME + " where " + Columns.SEQ + " = :seq";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource("seq", seq);
		// execute query
		try {
			return getNamedParameterJdbcTemplate().queryForObject(sql, params, rowMapper);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public GridModel findByGrid(String grid) throws Exception {
		// query
		String sql = "select * from " + GridDao.TABLE_NAME + " where " + Columns.GRID + " = :grid";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource("grid", grid);
		// execute query
		try {
			return getNamedParameterJdbcTemplate().queryForObject(sql, params, rowMapper);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}

	public int getCount() throws Exception {
		// query
		String sql = "select count(" + Columns.SEQ + ") from " + GridDaoImpl.TABLE_NAME;
		// execute query
		return getNamedParameterJdbcTemplate().queryForInt(sql, new HashMap<String, Object>());
	}

	public int update(GridModel sudoku) throws Exception {
		// query
		String sql = "update " + GridDao.TABLE_NAME + " set ";
		sql += Columns.GRID + " = :grid, ";
		sql += Columns.MODIFIED + " = :modified ";
		sql += " where " + Columns.SEQ + " = :seq";
		// parameter
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("grid", sudoku.getGrid());
		params.addValue("modified", new Date());
		params.addValue("seq", sudoku.getSeq());

		// execute query
		return getNamedParameterJdbcTemplate().update(sql, params);
	}

	public void delete(int seq) throws Exception {
		// query
		String sql = "delete from " + GridDao.TABLE_NAME + " where " + Columns.SEQ + " = :seq";
		// parameter
		SqlParameterSource params = new MapSqlParameterSource("seq", seq);

		// exeute query
		getNamedParameterJdbcTemplate().update(sql, params);
	}

	// row mapper
	class SudokuRowMapper implements RowMapper<GridModel> {

		public GridModel mapRow(ResultSet rs, int arg1) throws SQLException {
			GridModel sudoku = new GridModel();
			sudoku.setSeq(rs.getInt("seq"));
			sudoku.setGrid(rs.getString("grid"));
			sudoku.setCreated(rs.getTimestamp("created"));
			sudoku.setModified(rs.getTimestamp("modified"));
			// sudoku.setCost(rs.getTime("cost"));

			return sudoku;
		}

	}

}
